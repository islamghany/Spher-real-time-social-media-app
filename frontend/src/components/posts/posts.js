import React from "react";
import Feed from "./feed";
import Loading from "../../shared/loading";
import PostForm from "./post-form";

const Posts = React.memo(({ currentUser }) => {
  if (!currentUser || !currentUser.img || !currentUser.username) {
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
          img: currentUser.img,
        }}
      />
      <div className="post__container">
        <Feed
          uid={currentUser._id}
          token={currentUser.token}
          img={currentUser.img}
          username={currentUser.username}
        />
      </div>
    </div>
  );
});
export default Posts;
