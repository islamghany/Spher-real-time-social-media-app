import React, { useState, useEffect, useCallback } from "react";
import PostItem from "./post-item";
import Loading from "../../shared/loading";
import { useFetch } from "../../shared/hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import PostPlaceholer from "../placeholders/post-placeholder";
import InfiniteScroll from "react-infinite-scroll-component";

const style = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8,
  color: "#fff",
};

const RenderPosts = React.memo(({ token, uid, img, username }) => {
  const { request, loading, error } = useFetch();
  const posts = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const handlePosts = async () => {
    try {
      const responseData = await request(
        process.env.REACT_APP_BACKEND_URL + `/posts?skip=${posts.posts.length}`
      );
      dispatch({
        type: "FETCH_POSTS",
        payload: {
          posts: responseData.data.posts,
          length: responseData.data.length,
        },
      });
    } catch (err) {
      console.log(err, error);
    }
  };
  useEffect(() => {
    if (!posts.posts.length) handlePosts();
    document.title="Spher"
  }, []);
  let Posts;
  if (posts.posts && posts.posts.length) {
    Posts = (
      <InfiniteScroll
        dataLength={posts.length}
        next={handlePosts}
        hasMore={posts.posts.length < posts.length}
        loader={
          <div>
            <PostPlaceholer />
            <PostPlaceholer />
          </div>
        }
        endMessage={
          <p style={{ textAlign: "center" }} className="no-more">
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {posts.posts.map((post) => {
          return (
            <PostItem
              key={post._id}
              img={img}
              username={username}
              uid={uid}
              token={token}
              post={post}
            />
          );
        })}
        ;
      </InfiniteScroll>
    );
  } else if (error) {
    Posts = <h1>{error} please try again later.</h1>;
  } else
    Posts = (
      <div>
        <PostPlaceholer />
        <PostPlaceholer />
        <PostPlaceholer />
      </div>
    );
  return <div>{Posts}</div>;
});
export default RenderPosts;
