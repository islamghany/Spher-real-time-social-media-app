import React, { useState, useEffect, useReducer } from "react";
import { useFetch } from "../../shared/hooks/useFetch";
import { useSelector } from "react-redux";
import Loading from "../../shared/models/loading-modal";
import RenderComments from "./post-form/render-comments";
import socket from "../socket";

const reducer = (state, action, id) => {
  switch (action.type) {
    case "NEW_COMMENTS":
      return {
        comments: action.payload.comments,
        length: action.payload.length ? action.payload.length : state.length,
        loaded: true,
      };
    case "FETCH_COMMENTS":
      return {
        comments: [...state.comments, ...action.payload.comments],
        length: action.payload.length ? action.payload.length : state.length,
        loaded: true,
      };
    case "NEW_COMMENT":
      return {
        comments: [action.payload, ...state.comments],
        length: state.length + 1,
      };
  }
};

const PostFormComments = ({ postId, user, id }) => {
  const [content, setContent] = useState();
  const { error, loading, request } = useFetch();
  const [comments, dispatch] = useReducer(reducer, {
    comments: [],
    length: 0,
    loaded: false,
  });
  const addComment = async (content) => {
    setContent("");
    try {
      const response = await request(
        process.env.REACT_APP_BACKEND_URL + `/posts/comments/create`,
        "post",
        {
          content,
          userId: user._id,
          postId,
          img: user.img,
          username: user.username,
        },
        {
          Authorization: "Bearer " + user.token,
        }
      );
      dispatch({
        type: "NEW_COMMENT",
        payload: {
          ...response.data.comment,
          user: {
          img: user.img,
          _id: user._id,
          username: user.username,
          },
        },
      });
      if(response.data.notify){
      socket.emit("action", {
        state: "ADD",
        notify: response.data.notify,
        type: "SEND_NOTFY",
      });
    }
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    addComment(content);
  };

  const handlePostComments = async (load) => {
    try {
      const response = await request(
        process.env.REACT_APP_BACKEND_URL +
          `/posts/comments/${id}?skip=${load ? 0 : comments.comments.length}`
      );
      const length = response.data.length;
      if (!load) {
        dispatch({
          type: "FETCH_COMMENTS",
          payload: { comments: response.data.post.comments, length },
        });
      } else {
        dispatch({
          type: "NEW_COMMENTS",
          payload: { comments: response.data.post.comments, length },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    handlePostComments("load");
  }, [id]);
  if (comments.comments.length === 0 && comments.loaded === false)
    return <Loading />;
  return (
    <div className="post__comments">
      <ul className="post__comments__list">
        <RenderComments
          comments={comments}
          handlePostComments={handlePostComments}
        />
        {comments.comments.length < comments.length &&
          comments.comments.length != 0 && (
            <button
              className="btn btn--contained1-primary"
              disabled={loading}
              onClick={handlePostComments}
            >
              {loading ? "Loading" : "Load more comments"}
            </button>
          )}
      </ul>
      <div className="post__comments__form">
        <form onSubmit={handleSubmit}>
          <div className="form__unit">
            <input
              placeholder=" "
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form__input"
            />
            <label className="form__label">Write a comment</label>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PostFormComments;
