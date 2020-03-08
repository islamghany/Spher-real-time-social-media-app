import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../shared/models//loading-modal";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
const EditPost = props => {
  const { register, handleSubmit } = useForm();
  const id = props.match.params.id;
  const [isLoading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const token = useSelector(state => state.isSignedIn);
  const onSubmit = data => {
    setLoading(true);
    const instance = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URL+`/posts/edit`,
      headers: {
        Authorization: "Bearer " + token
      }
    });
    instance
      .patch(`/${id}`, data)
      .then(() => {
        props.history.push("/posts");
      })
      .catch(err => {
        console.log(err);
      });
    setLoading(false);
  };
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL+`/posts/${id}`)
      .then(res => {
        setPost(res.data.post);
      })
      .catch(err => {
        console.log(err);
      });
  }, [id]);
  if (!post || !token) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <div className="form__container">
      <div className="divider" />
      <div className="form__heading">
        <h3>Edit a post</h3>
      </div>
      <div className="form">
        <form className="form__body big" onSubmit={handleSubmit(onSubmit)}>
          <div className="form__unit">
            <div className="form__unit features">
              <textarea
                ref={register}
                defaultValue={post.title}
                name="title"
                placeholder="what in your mind..?"
              ></textarea>
            </div>
          </div>
          <button
            disabled={isLoading}
            className="btn btn--contained1-primary mg-none"
          >
            {isLoading ? "Updating...." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default EditPost;
