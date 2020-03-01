import React, { useState, useEffect, useCallback } from "react";
import { Menu_4 } from "../../assets/icons/icons";
import PostModel from "../../shared/models/post-model";

const RenderPosts = ({ posts, uid }) => {
  const [model, setModel] = useState(false);
  const closeModel = useCallback(() => {
    setModel(false);
  }, [setModel]);
  const [id, setId] = useState();
  useEffect(() => {
    window.addEventListener("click", closeModel);
    return () => window.removeEventListener("click", closeModel);
  }, [closeModel]);

  let Posts;
  if (posts) {
    Posts = posts.map(post => {
      return (
        <div className="post" key={post._id}>
          <div className="post__header">
            <div className="post__title">{post.title}</div>
            {uid === post.creator && (
              <div
                className="post__menu"
                onClick={e => {
                  e.stopPropagation();
                  setModel(true);
                  setId(post._id);
                }}
              >
                <span className="icon">
                  {" "}
                  <Menu_4 width="2.3rem" height="2.3rem" fill="#112" />
                </span>
              </div>
            )}
          </div>
          <div className="post__body">{post.body}</div>
        </div>
      );
    });
  } else Posts = null;
  return (
    <div>
      {model && <PostModel id={id} closeModel={closeModel} />}
      {Posts}
    </div>
  );
};
export default RenderPosts;
