import React from "react";

const PostForm = ({
  register,
  onSubmit,
  handleSubmit,
  initialValues = {},
  loading
}) => {
  return (
    <div className="form__container">
      <div className="divider" />
      <div className="form__heading">
        <h3>Write a pots</h3>
      </div>
      <div className="form">
        <form className="form__body big" onSubmit={handleSubmit(onSubmit)}>
          <div className="form__unit">
            <input
              name="title"
              type="text"
              defaultValue={initialValues ? initialValues.title : ""}
              ref={register}
              className="form__input"
              placeholder="Title"
              autoComplete="off"
            />
            <div className="form__unit">
              {" "}
              <textarea
                ref={register}
                defaultValue={initialValues ? initialValues.body : ""}
                name="body"
                placeholder="wrrie something in your mind"
              ></textarea>{" "}
            </div>
          </div>
          <button
            disabled={loading}
            className="btn btn--contained1-primary block mg-none"
          >
            {loading ? "Posting...." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default PostForm;
