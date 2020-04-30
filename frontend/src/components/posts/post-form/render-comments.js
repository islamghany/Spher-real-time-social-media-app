import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../../shared/loading.js";
import {Link} from 'react-router-dom'
const RenderComments = ({ comments, handlePostComments }) => {
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
    <>
      {comments.comments.map((comment) => (
        <li className="post__comments__item" key={comment._id}>
          <Link to={`/user/${comment.user._id}`}>
          <div className="comment__user">
            <div className="comment__user--img">
              <img src={comment.user.img} alt="aa" />
            </div>
            <div className="comment__user--name">{comment.user.username}</div>
          </div>
          </Link>
          <div className="comment__content">
            <p>{comment.content}</p>
          </div>
          <div className="comment__time">{getLeftTime(comment.createdAt)}</div>
        </li>
      ))}
    </>
  );
};
export default RenderComments;
