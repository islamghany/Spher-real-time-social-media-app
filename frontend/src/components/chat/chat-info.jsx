import React, { useState, useEffect } from "react";
import { useFetch } from "../../shared/hooks/useFetch";
import { Link } from "react-router-dom";
const ChatInfo = ({ roomId, CloseInfo }) => {
  const { request, loading, error, clearError } = useFetch();
  const [roomInfo, setRoomInfo] = useState();
  const fetchRoom = async () => {
    try {
      const response = await request(
        process.env.REACT_APP_BACKEND_URL + `/chat/get/${roomId}`
      );
      setRoomInfo(response.data.chatRoomData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchRoom();
  }, []);
  return (
    <div
      className="chat__room fade-in-top"
      onClick={(e) => e.stopPropagation()}
    >
      {roomInfo && (
        <>
          <div className="chat__room__info">
            <div className="chat__room__info__img">
              <img src={roomInfo.chatIcon} alt="aa" />
            </div>
            <h5>{roomInfo.name}</h5>
          </div>
          <div className="seprator" />
          <h2 className="h2">Members ({roomInfo.members.length})</h2>
          <ul className="chat__room__list">
            {roomInfo.members.map((member) => (
              <Link to={`/user/${member._id}`}>
                <li className="chat__room__item">
                  <div className={`chat__room__item--img`}>
                    {member.isOnline && <div className="userActive"></div>}
                    <img src={member.img} alt="aa" />
                  </div>
                  <h4>{member.username}</h4>
                </li>
              </Link>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
export default ChatInfo;
