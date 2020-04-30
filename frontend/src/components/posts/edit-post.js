import React, { useEffect, useState } from "react";
import Loading from "../../shared/models/loading-modal";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useFetch } from "../../shared/hooks/useFetch";

const EditPost = (props) => {
  const { register, handleSubmit } = useForm();
  const { error, loading, request } = useFetch();
  const id = props.match.params.id;
  const [title, setTitle] = useState(
    props.location.state ? props.location.state.title : null
  );
  const dispatch = useDispatch();
  const token = useSelector((state) => state.isSignedIn);
  const onSubmit = async (data) => {
    try {
      await request(
        process.env.REACT_APP_BACKEND_URL + `/posts/edit/${id}`,
        "patch",
        data,
        {
          Authorization: "Bearer " + token,
        }
      );
      dispatch({
        type: "EDIT_POST",
        payload: {
          id,
          title: data.title,
        },
      });
      props.history.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  const fetchPost = async () => {
    try {
      const res = await request(
        process.env.REACT_APP_BACKEND_URL + `/posts/${id}`
      );
      setTitle(res.data.post ? res.data.post.title : "");
      if (!res.data.post) props.history.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    document.title="Edit your post"
    if (!title) {
      fetchPost();
    }
  }, []);

  if (!title && loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <div>
      <div className="profile__header">
        <div
          className="profile__header--icon"
          onClick={() => props.history.goBack()}
        >
          <svg viewBox="0 0 24 24">
            <g>
              <path d="M20 11H7.414l4.293-4.293c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0l-6 6c-.39.39-.39 1.023 0 1.414l6 6c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L7.414 13H20c.553 0 1-.447 1-1s-.447-1-1-1z"></path>
            </g>
          </svg>
        </div>
        <h2>Edit Your Post</h2>
      </div>
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
                  defaultValue={title}
                  name="title"
                  placeholder="what in your mind..?"
                ></textarea>
              </div>
            </div>
            <button
              disabled={loading}
              className="btn btn--contained1-primary mg-none"
            >
              {loading ? "Updating...." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default EditPost;
