import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import RenderPosts from "./render-posts";
import Loading from "../../shared/loading";
import PostForm from "./post-form";
import { useSelector, useDispatch } from "react-redux";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Posts = props => {
  const currentUser = useSelector(state => state.currentUser);
  const posts = useSelector(state => state.posts);
  const { isLoading, error, sendRequest } = useHttpClient();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const handlePosts = async (
    type,
    prop,
    method = "GET",
    data = null,
    header = { "Content-Type": "application/json" }
  ) => {
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/posts",
        method,
        data,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentUser.token
        }
      );
      dispatch({ type: type, payload: responseData[prop] });
    } catch (err) {
      console.log(err, error, "jnjn");
    }
  };
  const onSubmit = data => {
    handlePosts(
      "CREATE_POST",
      "post",
      "POST",
      JSON.stringify({
        ...data,
        creator: currentUser._id
      }),
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentUser.token
      }
    );
  };
  useEffect(() => {
    handlePosts("FETCH_POSTS", "posts");
  }, []);

  if (!currentUser) return <Loading />;
  return (
    <div>
      <PostForm
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        loading={isLoading}
        register={register}
      />
      <div className="post__container">
        {posts ? (
          <RenderPosts posts={posts} uid={currentUser._id} />
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};
export default Posts;
