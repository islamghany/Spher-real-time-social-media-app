import React, { useState, useEffect, useReducer, useCallback } from "react";
import { Search, Add, Friends } from "../../assets/icons/icons";
import Loading from "../../shared/loading.js";
import RenderFriends from "./render-friends";
import { useFetch } from "../../shared/hooks/useFetch";
import { useSelector } from "react-redux";
import ChatForm from "./chat-form";
import socket from "../socket";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROOMS":
      return action.payload;
    case "ADD_ROOM":
      return [action.payload, ...state];
    case "FILTER_ROOMS":
      return action.payload.list.filter((room) =>
        room.data.name.includes(action.payload.keyword)
      );
    default:
      return state;
  }
};

const ChatFriends = ({ goBack }) => {
  const currentUser = useSelector((state) => state.currentUser);
  const [rooms, dispatch] = useReducer(reducer, []);
  const [searchValue, setSearchValue] = useState();
  const [chatForm, setChatForm] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [seatchedRooms, setSearchedRooms] = useState();
  const { request, error, loading, clearError } = useFetch();
  const [isGroup, setIsGroup] = useState(false);
  const matches = useMediaQuery("(max-width:600px)");

  const closeForm = () => {
    setChatForm(false);
  };
  let timer;
  const getUserRooms = async () => {
    try {
      const responsedData = await request(
        process.env.REACT_APP_BACKEND_URL + `/users/rooms/${currentUser._id}`
      );
      dispatch({ type: "FETCH_ROOMS", payload: responsedData.data.rooms });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUserRooms();
  }, []);
  let x;
  const filterRooms = (keyword) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      x = keyword;
      setSearchedRooms(
        rooms.filter((room) => room.data.name.includes(keyword))
      );
    }, 300);
  };

  const hideGroup = useCallback(() => {
    setIsGroup(false);
  }, []);
  useEffect(() => {
    socket.on("action", (action) => {
      switch (action.type) {
        case "CREATE_CAHT_ROOM": {
          dispatch({ type: "ADD_ROOM", payload: action.chatRoom });
          break;
        }
        case "RENDER_ROOMS": {
          getUserRooms();
          break;
        }
      }
    });
  }, []);
  const h = matches && isGroup;
  return (
    <>
      {" "}
      <span
        className="show-group"
        onClick={(e) => {
          e.stopPropagation();
          setIsGroup(true);
        }}
      >
        <Friends />
      </span>
      <div
      onClick={hideGroup}
        className={`${
          h ? "chat__friends__wrapper" : matches ? " " : "chat__friends__sfs"
        }`}
      >
        <div
          className={`chat__friends ${
            !h ? "hero" : matches ? "slide-in-left" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
        
          
          
          <div className="chat__header">
            <div className="chat__header--icon" onClick={goBack}>
              <svg viewBox="0 0 24 24">
                <g>
                  <path d="M20 11H7.414l4.293-4.293c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0l-6 6c-.39.39-.39 1.023 0 1.414l6 6c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z"></path>
                </g>
              </svg>
            </div>
            <div className="chat__header--img">
              <img src={currentUser.img} alt="aa" />
            </div>
          </div>
          <div className="chat__friends--search">
            <div className="chat__friends--unit">
              <span className="search-icon">
                <Search width="2rem" height="2rem" fill="#222" />
              </span>
              <input
                type="text"
                placeholder="Search for your rooms"
                className="chat__input"
                onChange={(e) => filterRooms(e.target.value)}
              />
            </div>
          </div>
          <div className="chat__friends__add">
            <h2>Add new room</h2>
              <ChatForm dispatchRoom={dispatch}><div className="icon" onClick={() => setChatForm(true)}>
              <Add width="3rem" height="3rem" fill="#fff" />
            </div></ChatForm>
          </div>
          <div className="chat__friends--friends-list">
            <ul className="chat__friends--list">
              {loading && !rooms.length ? (
                <Loading />
              ) : (
                <RenderFriends rooms={seatchedRooms || rooms} />
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default ChatFriends;
