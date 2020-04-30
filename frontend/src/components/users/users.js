import React from "react";
import { Link } from "react-router-dom";
const UserItem = ({ user }) => {
  return (
    <div className="user">
      <div className="user__header">
        <div className="user__img">
          <Link to={`/user/${user._id}`}>
            <img src={user.img} alt={user.username} />
          </Link>
        </div>
        <div className="user__info">
          <Link to={`/user/${user._id}`}>
            <div className="user__username">{user.username}</div>{" "}
          </Link>
          <div className="user__name">{user.name}</div>
        </div>
      </div>
      <div className="user__add" title="add to your chat">
        <img
          src="https://static.xx.fbcdn.net/rsrc.php/v3/y0/r/dtFHqE_yJlH.png"
          alt="add to your chat"
        />
      </div>
    </div>
  );
};
export default UserItem;
