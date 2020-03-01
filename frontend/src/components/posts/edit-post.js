import React, { useEffect, useState } from "react";
import PostForm from "./post-form";
import axios from "axios";
import Loading from "../../shared/loading";
import { useForm } from "react-hook-form";

const EditPost = props => {
  const { register, handleSubmit, watch, errors } = useForm();
  const id = props.match.params.id;
  const [post, setPost] = useState(null);
  const onSubmit = data => {
    console.log(data);
    axios
      .patch(`http://localhost:5000/api/posts/${id}`, data)
      .then(() => {
        props.history.push("/posts");
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/posts/${id}`)
      .then(res => {
        setPost(res.data.post);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  if (!post) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <div>
      <PostForm
        register={register}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        initialValues={post}
      />
    </div>
  );
};
export default EditPost;
