import React from "react";
import { NavLink } from "react-router-dom";

const RenderFriends = React.memo(({ rooms }) => {
  const calcPastTime = (lastDate) => {
    const leftHours =
      new Date(new Date().getTime() - new Date(lastDate).getTime()).getTime() /
      (1000 * 3600);
    if (leftHours < 1) {
      let t = Math.ceil(leftHours * 60);
      return t + (t === 1 ? " M" : " MS");
    }
    if (leftHours < 24) {
      let t = Math.floor(leftHours);
      return t + (t === 1 ? " H" : " HS");
    }
    if (leftHours < 24 * 7) {
      let t = Math.floor(leftHours / 24);
      return t + (t === 1 ? " D" : " DS");
    }
    if (leftHours < 24 * 30) {
      let t = Math.floor(leftHours / (24 * 7));
      return t + (t === 1 ? "W" : " WS");
    }
    if (leftHours < 365 * 24) {
      let t = Math.floor(leftHours / (24 * 30));
      return t + (t === 1 ? " MN" : " MNS");
    } else {
      let t = Math.floor(leftHours / (365 * 24));
      return t + (t === 1 ? " Y" : " YS");
    }
  };
  if (rooms.length) {
    return rooms.map((room) => {
      return (
        <NavLink exact to={`/chat/${room.data._id}`}>
          <li
            className={`chat__friends--item ${
              room.unReadMessages > 0 ? "unread" : ""
            }`}
            key={room.data._id}
          >
            {room.unReadMessages > 0 && (
              <div className="unread__not">{room.unReadMessages}</div>
            )}
            <div className="chat__friends--user">
              <div className="cf__img">
                <img src={room.data.chatIcon} alt="user" />
              </div>
              <div className="cf__info">
                <h1>{room.data.name}</h1>
                {room.lastMessage && <p>{room.lastMessage}</p>}
              </div>
            </div>
            <div className="chat__friends--lastsent">
              {calcPastTime(room.data.updatedAt)}
            </div>
          </li>
          <div className="seprator"></div>
        </NavLink>
      );
    });
  }
  return (
    <li className="chat__friends--item">
      <h1>no chats found! </h1>
    </li>
  );
});
export default RenderFriends;
