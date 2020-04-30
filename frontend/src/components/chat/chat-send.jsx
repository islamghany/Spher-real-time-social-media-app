import React, { useState } from "react";
import { Share, Emojy } from "../../assets/icons/icons";
import { useFetch } from "../../shared/hooks/useFetch";
import socket from "../socket";
import EmojyPicker from "../posts/post-form/emojy-picker";

const ChatSend = React.memo(({ userId, roomId, serverSendMessage, token }) => {
  const [text, setText] = useState("");
  const { request, loading, error } = useFetch();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      setText("");
      try {
        const response = await request(
          process.env.REACT_APP_BACKEND_URL + "/messages/send",
          "post",
          {
            userId,
            text,
            roomId,
          },
          {
            Authorization: "Bearer " + token,
          }
        );
        serverSendMessage(response.data.message);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const addEmojy = (e) => {
    setText((el) => el + e);
  };
  return (
    <div className="chat__send">
      {" "}
      <form onSubmit={sendMessage} className="form__row">
        <EmojyPicker
          handleChange={addEmojy}
          style={{
            bottom: " 100%",
            left: 0,
          }}
        />

        <div className="chat__send--form">
          <input
            type="text"
            value={text}
            maxLength="155"
            onChange={(e) => setText(e.target.value)}
            className="chat__input p"
            placeholder="Type a message"
          />
        </div>
        <span className="icon" onClick={sendMessage}>
          <Share />
        </span>
      </form>
    </div>
  );
});
export default ChatSend;
