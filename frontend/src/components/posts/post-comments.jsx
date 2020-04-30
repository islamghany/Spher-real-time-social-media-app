import React, { useState, useEffect } from "react";
import { useFetch } from "../../shared/hooks/useFetch";
import PostItem from "./post-item";
import { useSelector } from "react-redux";
import Loading from "../../shared/models/loading-modal";
import PostFormComments from "./post-form-comments";
import history from "../../history";

const PostComments = (props) => {
  const user = useSelector((state) => state.currentUser);
  const id = props.match.params.id;
  const { error, loading, request } = useFetch();
  const [post, setPosts] = useState();
  const changeTitle=(title)=>{
    document.title=title;
  }
  const handlePost = async () => {
    try {
      const response = await request(
        process.env.REACT_APP_BACKEND_URL + `/posts/${id}`
      );
      setPosts(response.data.post);
      if(response.data.post.creator &&  response.data.post.creator.username){
        if(response.data.post.creator._id == user._id){
          changeTitle("Your post")
        }else changeTitle(`${response.data.post.creator.username} post`)
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    handlePost();
  }, [id]);

  if (!post || loading) {
    return <Loading />;
  }
  return (
    <div>
      <div className="profile__header">
        <div className="profile__header--icon" onClick={() => history.goBack()}>
          <svg viewBox="0 0 24 24">
            <g>
              <path d="M20 11H7.414l4.293-4.293c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0l-6 6c-.39.39-.39 1.023 0 1.414l6 6c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z"></path>
            </g>
          </svg>
        </div>
        <h2>{post.creator.username}'s Post</h2>
      </div>
      <PostItem
        uid={user._id}
        img={user.img}
        username={user.username}
        token={user.token}
        post={post}
      />
      <PostFormComments id={id} user={user} postId={post._id} />
    </div>
  );
};
export default PostComments;
