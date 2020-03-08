import React,
 { useState, useEffect, useCallback, useRef } from "react";
import { Menu_2, Heart, Heart_4 } from "../../assets/icons/icons";
import PostModel from "../../shared/models/post-model";
import { useHttpClient } from "../../shared/hooks/http-hook";

const PostItem = ({ post, uid, token }) => {
  const [model, setModel] = useState(false);
  const [liked, setLiked] = useState(post.liked.indexOf(uid));
  const nol = useRef(post.liked.length);
  const test = useRef(null);
  const { sendRequest } = useHttpClient();

  const handleLike = async () => {
    try {
        await sendRequest(
        process.env.REACT_APP_BACKEND_URL+"/posts/post",
        "PATCH",
        JSON.stringify({
          postId: post._id,
          creator: uid
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
  const closeModel = useCallback(() => {
    setModel(false);
  }, [setModel]);
  const [id, setId] = useState();
  useEffect(() => {
    window.addEventListener("click", closeModel);
    return () => window.removeEventListener("click", closeModel);
  }, [closeModel]);
  useEffect(() => {
    if (test.current) {
      const timer = setTimeout(() => {
        handleLike();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [liked]);
  const getLeftTime = oldTime => {
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
      {model && <PostModel id={id} closeModel={closeModel} />}
      <div className="post__header">
        <div className="post__header--info">
          <div
            className="post__header--img"
            style={{
              background: `url(${
                post.creator.img[0] === "d" || post.creator.img[0] === "h"
                  ? post.creator.img
                  : `data:image/png;base64,${post.creator.img.toString(
                      "base64"
                    )}`
              })`,
              backgroundSize: "cover",
              backgrounPosition: "center center"
            }}
          ></div>
          <div className="post__header--name">
            <span className="name">{post.creator.username}</span>
            {post.location !== "null" && (
              <span className="place">{post.location}</span>
            )}
          </div>
        </div>
        {uid === post.creator._id && (
          <div
            className="post__menu"
            onClick={e => {
              e.stopPropagation();
              setModel(true);
              setId(post._id);
            }}
          >
            <span className="icon">
              <Menu_2 width="2.3rem" height="2.3rem" fill="#fff" />
            </span>
          </div>
        )}
      </div>
      {post.title && (
        <div className="post__content">
          <p>{post.title ? post.title : null}</p>
        </div>
      )}
      {post.img && (
        <div className="post__body">
          <img
            src={
              post.new
                ? post.img
                : `data:image/png;base64,${post.img.toString("base64")}`
            }
          />
        </div>
      )}
      <div className="post__tail">
        <div className="post__tail--like">
          <span className="nol">{nol.current}</span>
          <span
            className="icon"
            onClick={() => {
              liked < 0 ? ++nol.current : --nol.current;
              setLiked(e => (e === 0 ? -1 : e * -1));
              if (!test.current) test.current = 1;
            }}
          >
            {liked < 0 ? (
              <Heart width="2.3rem" height="2.3rem" fill="#fff" />
            ) : (
              <Heart_4 width="2.3rem" height="2.3rem" fill="#fff" />
            )}
          </span>
        </div>
        <div className="post__tail--time-left">
          {getLeftTime(post.createdAt)}
        </div>
      </div>
    </div>
  );
};
export default PostItem;
