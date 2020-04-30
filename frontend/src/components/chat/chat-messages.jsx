import React, { useState, useEffect } from "react";
import ChatHeader from "./chat-header";
import ChatBody from "./chat-body";
import ChatSend from "./chat-send.jsx";
import Loading from "../../shared/loading.js";
import socket from "../socket";
import { useSelector } from "react-redux";
import { useFetch } from "../../shared/hooks/useFetch";
import InfiniteScroll from "react-infinite-scroller";

const CahtMessages = React.memo((props) => {
  const user = useSelector((state) => state.currentUser);
  const id = props.match.params.id;
  const { request, loading, error, clearError } = useFetch();
  const [messages, setMessages] = useState([]);
  const [way, setWay] = useState(true);
  const [roomInfo, setRoomInfo] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoadind] = useState(true);
  const changeTitle=(title)=>{
    document.title=title;
  }
  const fetchRoomsMessages = async (newLoad) => {
    try {
      const response = await request(
        process.env.REACT_APP_BACKEND_URL + "/messages",
        "post",
        {
          userId: user._id,
          roomId: id,
          skip: newLoad ? 0 : messages.length,
          newLoad: newLoad ? "load" : "alt",
        },
        {
          Authorization: "Bearer " + user.token,
        }
      );
      if (newLoad) {
        setRoomInfo(response.data.roomInfo);
        if(response.data.roomInfo && response.data.roomInfo.name)changeTitle(`Chat (${response.data.roomInfo.name})`)
      }
      if (way !== "render") setWay(true);
      if (!newLoad) setMessages((e) => [...response.data.messages, ...e]);
      else setMessages(response.data.messages);
      if (response.data.messages.length < 20) setHasMore(false);
    } catch (err) {
      console.log(err);
    }
    setIsLoadind(false);
  };

  const serverSendMessage = (message) => {
    setWay(false);
    setMessages((e) => [...e, message]);
    socket.emit("action", {
      message,
      type: "SEND_MESSAGE",
      roomId: id,
      userId: user._id,
      username: user.username,
    });
  };
  useEffect(() => {
    socket.emit("action", {
      type: "JOIN_CHAT_ROOM",
      roomId: id,
    });
    setHasMore(true);
    setIsLoadind(true);
    fetchRoomsMessages(true);
    return () => {
      socket.emit("action", {
        type: "LEAVE_CHAT_ROOM",
        roomId: id,
      });
    };

  }, [id]);
  useEffect(() => {
    socket.on("action", (action) => {
      if (action.type === "ClIENT_SEND_MESSAGE") {
        if (way !== "add") setWay("add");
        setMessages((e) => [...e, action.message]);
      }
    });
  }, []);

  if (!id) return null;
  if (isLoading)
    return (
      <div style={{ flex: 1, display: "flex" }}>
        <Loading />
      </div>
    );
  return (
    <div className="chat__messages">
      {loading && !messages.length ? (
        <Loading />
      ) : (
        <>
          <ChatHeader
            roomInfo={roomInfo}
            userId={user._id}
            token={user.token}
            serverSendMessage={serverSendMessage}
          />
          <ChatBody
            userId={user._id}
            hasMore={hasMore}
            fetchRoomsMessages={fetchRoomsMessages}
            messages={messages}
            isLoading={loading}
            token={user.token}
            roomId={id}
            way={way}
          />
          <ChatSend
            userId={user._id}
            token={user.token}
            serverSendMessage={serverSendMessage}
            roomId={id}
          />
        </>
      )}
    </div>
  );
});
export default CahtMessages;
