import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useFetch } from "../../../shared/hooks/useFetch";
import ProfileBoard from "./profile-board";
import ProfileFeed from "./profile-feed";
import ProfilePlaceholer from "../../placeholders/profile-placehoder";
import { Redirect } from "react-router-dom";
import history from "../../../history";

const Profile = (props) => {
  const { loading, request, error } = useFetch();
  const [user, setUser] = useState(null);
  const [img, setImg] = useState(null);
  const currentUser = useSelector((state) => state.currentUser);
  const id = props.match.params.id;
  const changeTitle=(title)=>{
    document.title=title;
  }
  const fetchProfileData = async () => {
    try {
      const res = await request(
        process.env.REACT_APP_BACKEND_URL + `/users/${id}`
      );
      setUser(res.data.user);
      if(res.data.user && res.data.user.username) changeTitle(res.data.user.username);
    } catch (err) {
      console.log(err);
    }
  };
  const changeImg = (img) => {
    setImg(img);
  };
  useEffect(() => {
    fetchProfileData();
  }, [id]);
  if (!loading && user && user._id && currentUser && currentUser.token) {
    const isProfile = currentUser._id === user._id;
    if (isProfile && props.match.path === "/user/:id") {
      return <Redirect to={`/profile/${user._id}`} />;
    }
    if (!isProfile && props.match.path === "/profile/:id")
      return <Redirect to={`/user/${id}`} />;
    return (
      <div className={`profile ${isProfile ? "mt-2" : ""}`}>
        {!isProfile && (
          <div className="profile__header">
            <div
              className="profile__header--icon"
              onClick={() => history.goBack()}
            >
              <svg viewBox="0 0 24 24">
                <g>
                  <path d="M20 11H7.414l4.293-4.293c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0l-6 6c-.39.39-.39 1.023 0 1.414l6 6c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z"></path>
                </g>
              </svg>
            </div>
            <h2>{user.username}</h2>
          </div>
        )}
        <ProfileBoard
          user={user}
          img={img}
          setImg={changeImg}
          isProfile={isProfile}
        />
        <ProfileFeed
          length={user.posts.length}
          user={currentUser}
          id={id}
          isProfile={isProfile}
          img={img || user.img}
          username={user.username}
        />
      </div>
    );
  }
  return <ProfilePlaceholer />;
};
export default Profile;
