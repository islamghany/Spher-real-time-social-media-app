import React, { useState, useEffect, useCallback } from "react";
import PostItem from "./post-item";
import Loading from "../../shared/loading";
const RenderPosts = React.memo(({ posts, uid, token }) => {
  let Posts;
  if (posts) {
    Posts = posts.map(post => {
      return <PostItem key={post._id} uid={uid} token={token} post={post} />;
    });
  } else Posts = <Loading />;
  return <div>{Posts}</div>;
});
export default RenderPosts;
