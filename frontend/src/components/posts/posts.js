
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import RenderPosts from "./render-posts";
import Loading from "../../shared/loading";
import PostForm from "./post-form";
import { useSelector, useDispatch } from "react-redux";
import { useHttpClient } from "../../shared/hooks/http-hook";
import axios from "axios";

const Posts = React.memo(({ currentUser }) => {
  const posts = useSelector(state => state.posts);
  const { isLoading, error, sendRequest } = useHttpClient();
  const dispatch = useDispatch();
  
  const handlePosts = async (
    type,
    prop,
    method = "GET",
    data = null,
    header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + currentUser.token
    }
  ) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL+"/posts",
        method,
        data,
        header
      );
      dispatch({ type: type, payload: responseData[prop] });
    } catch (err) {
      console.log(err, error, "jnjn");
    }
  };

  useEffect(() => {
    handlePosts("FETCH_POSTS", "posts");
  }, []);
  if ( !currentUser || !currentUser.img || !currentUser.username){
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <div>
      <PostForm
        user={{
          username: currentUser.username,
          token: currentUser.token,
          id: currentUser._id,
          img: currentUser.img
        }}
      />
      <div className="post__container">
        {posts.length ? (
          <RenderPosts
            posts={posts}
            token={currentUser.token}
            uid={currentUser._id}
          />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
});
export default Posts;
