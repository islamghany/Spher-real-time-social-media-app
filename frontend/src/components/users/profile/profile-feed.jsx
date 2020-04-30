import React, { useState, useEffect } from "react";
import PostItem from "../../posts/post-item";
import { useFetch } from "../../../shared/hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import PostPlaceholer from "../../placeholders/post-placeholder";
import InfiniteScroll from "react-infinite-scroll-component";

const ProfileFeed = React.memo(
  ({ length, isProfile, user, img, username, id }) => {
    const userPost = useSelector((state) => state.userPost);
    const [posts, setPosts] = useState([]);
    const { request, loading, error } = useFetch();
    const dispatch = useDispatch();
    const [hasMore, setHasMore] = useState(true);
    const handlePosts = async () => {
      try {
        const responseData = await request(
          process.env.REACT_APP_BACKEND_URL +
            `/users/${id}?skip=${isProfile ? userPost.length : posts.length}`
        );
        if (responseData.data.posts.length < 5) {
          setHasMore(false);
        }
        if (isProfile) {
          dispatch({ type: "MORE_POSTS", payload: responseData.data.posts });
        } else {
          setPosts((e) => [...e, ...responseData.data.posts]);
        }
      } catch (err) {
        console.log(err, error);
      }
    };
    useEffect(() => {
      handlePosts();
    }, []);
    return (
      <div className="mt-5">
        {(isProfile ? userPost : posts).map((post) => (
          <PostItem
            path="stay"
            post={post}
            key={post._id}
            username={username}
            img={img}
            uid={user._id}
            token={user.token}
          />
        ))}

        {loading && (
          <div>
            <PostPlaceholer />
          </div>
        )}
        {!loading &&
          ((isProfile && length > userPost.length) ||
            (!isProfile && length > posts.length)) && (
            <div className="has-more">
              <button className="nude" onClick={handlePosts}>
                Load More Posts
              </button>
            </div>
          )}
      </div>
    );
  }
);
export default ProfileFeed;
