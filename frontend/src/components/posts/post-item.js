import React, { useState, useEffect, useCallback, useRef } from "react";
import { Menu_2, Heart, Heart_4, Comment2 } from "../../assets/icons/icons";
import PostModel from "../../shared/models/post-model";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { Link } from "react-router-dom";
import LightBoxImage from "./image-preview";
import socket from "../socket";

const PostItem = ({ post, path, uid, token, img, username }) => {
  const [liked, setLiked] = useState(post.liked.indexOf(uid));
  const nol = useRef(post.liked.length);
  const test = useRef(null);
  const { sendRequest } = useHttpClient();
  const [isOpen, setIsOpen] = useState(false);

  const handleLike = async () => {
    try {
      const like = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/posts/post",
        "PATCH",
        JSON.stringify({
          postId: post._id,
          creator: uid,
          img,
          username,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        }
      );

      socket.emit("action", {
        ...like,
        type: "SEND_NOTFY",
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  const [id, setId] = useState();
  
  useEffect(() => {
    if (test.current) {
      const timer = setTimeout(() => {
        handleLike();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [liked]);
  const getLeftTime = (oldTime) => {
    const now = new Date();
    const leftTime = new Date(oldTime).getTime();
    const leftHours = (now.getTime() - leftTime) / (1000 * 3600);
    if (leftHours < 1) {
      let t = Math.ceil(leftHours * 60);
      return t + (t === 1 ? " MINUTE" : " MINUTES") + " AGO";
    }
    if (leftHours < 24) {
      let t = Math.floor(leftHours);
      return t + (t === 1 ? " Hour" : " Hours") + " AGO";
    }
    if (leftHours < 24 * 7) {
      let t = Math.floor(leftHours / 24);
      return t + (t === 1 ? " Day" : " Day") + " AGO";
    }
    if (leftHours < 24 * 30) {
      let t = Math.floor(leftHours / (24 * 7));
      return t + (t === 1 ? " Week" : " Weeks") + " AGO";
    }
    if (leftHours < 365 * 24) {
      let t = Math.floor(leftHours / (24 * 30));
      return t + (t === 1 ? " Month" : " Months") + " AGO";
    } else {
      let t = Math.floor(leftHours / (365 * 24));
      return t + (t === 1 ? " Year" : " Years") + " AGO";
    }
  };
  return (
    <div className="post" key={post._id}>
      {isOpen && (
        <LightBoxImage image={isOpen} closeLightBox={() => setIsOpen(false)} />
      )}
      
      <div className="post__header">
        <div className="post__header--info">
          <div className="post__header--img">
            {post.creator.isOnline && <div className="userActive"></div>}
            <Link to={`/user/${post.creator._id || post.creator}`}>
              <img src={post.creator.img || img} alt="aa" />
            </Link>
          </div>
          <div className="post__header--name">
            <Link to={`/user/${post.creator._id || post.creator}`}>
              <span className="name">{post.creator.username || username}</span>
            </Link>
            {post.location !== "null" && (
              <span className="place">{post.location}</span>
            )}
          </div>
        </div>
        {uid === (post.creator._id ? post.creator._id : post.creator) && (
          <PostModel
          path={path}
          id={id || post._id}
          title={post.title}
          >
          <div className="post__menu">     
            <span className="icon">
              <Menu_2 width="2.3rem" height="2.3rem" fill="#fff" />
            </span>
          </div>
          </PostModel>
        )}
      </div>
      {post.title && (
        <div className="post__content">
          <p>{post.title ? post.title : null}</p>
        </div>
      )}
      {post.img && (
        <div className="post__body">
          <img src={post.img} onClick={() => setIsOpen(post.img)} />
        </div>
      )}
      <div className="post__tail">
        <div className="post__tail__communication">
          <div className="post__tail__communication__item">
            <span
              className="icon"
              onClick={() => {
                liked < 0 ? ++nol.current : --nol.current;
                setLiked((e) => (e === 0 ? -1 : e * -1));
                if (!test.current) test.current = 1;
              }}
            >
              {liked < 0 ? (
                <Heart width="2rem" height="2rem" fill="#fff" />
              ) : (
                <Heart_4 width="2rem" height="2rem" fill="#fff" />
              )}
            </span>
            <span className="nol">{nol.current}</span>
          </div>
          <Link to={`/post/${post._id}`}>
            <div className="post__tail__communication__item">
              <span className="icon">
                <Comment2 width="2rem" height="2rem" fill="#fff" />
              </span>
              <span className="nol">
                {post.comments ? post.comments.length : 0}
              </span>
            </div>
          </Link>
        </div>
        <div className="post__tail--time-left">
          {getLeftTime(post.createdAt)}
        </div>
      </div>
    </div>
  );
};
export default PostItem;
