import React, { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Delete } from "../../assets/icons/icons.js";
import GetLocation from "./post-form/get-location";
import EmojyPicker from "./post-form/emojy-picker";
import ErrorModal from "../../shared/models/error-model";
import LoadingPage from "../../shared/models/loading-modal";
import { useFetch } from "../../shared/hooks/useFetch";
import PostImage from "./post-form/post-image";
import { useDispatch } from "react-redux";

const PostForm = React.memo(({ user }) => {
  const { loading, request, error, clearError } = useFetch();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState(null);
  const dispatch = useDispatch();
  const filePickerRef = useRef();
  const [previewUrl, setPreviewUrl] = useState();
  const [files, setFiles] = useState();
  const [imgData, setImgData] = useState();

  const pickedHandler = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFiles(pickedFile);
    }
  };
  const removeImage = (idx) => {
    setFiles(null);
    setPreviewUrl(null);
  };
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  const createPost = async (data) => {
    try {
      const formData = new FormData();
      if (imgData && imgData.width) {
        formData.append("x", imgData.x);
        formData.append("y", imgData.y);
        formData.append("width", imgData.width);
        formData.append("height", imgData.height);
      }
      formData.append("title", data.title);
      formData.append("location", data.location);
      formData.append("img", data.img);
      formData.append("creator", data.creator);
      const responseData = await request(
        process.env.REACT_APP_BACKEND_URL + "/posts",
        "post",
        formData,
        {
          Authorization: "Bearer " + user.token,
        }
      );
      const newPost = {
        createdAt: new Date().toISOString(),
        username: user.username,
        img: user.img,
        _id: user.id,
        isOnline: true,
      };
      dispatch({
        type: "CREATE_POST",
        payload: {
          ...responseData.data.post,
          creator: newPost,
        },
      });
      dispatch({
        type: "ONE_MORE_POST",
        payload: {
          ...responseData.data.post,
          creator: newPost,
        },
      });
      removeImage();
      setTitle("");
      setLocation(null);
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = (e) => {
    setTitle(e.target.value);
  };
  const addEmojy = (e) => {
    setTitle((el) => el + e);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ title, img: files, location, creator: user.id });
  };
  const setCropData = (data) => {
    setImgData({ ...data });
  };
  useEffect(() => {
    if (!files) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(files);
  }, [files]);

  return (
    <div className="form__container">
      {loading && <LoadingPage />}
      {error && (
        <ErrorModal state="error" closeModal={clearError} message={error} />
      )}
      <div className="divider" />
      <div className="form__heading">
        <h3>Write a post</h3>
      </div>
      <div className="form">
        <form className="form__body big" onSubmit={handleSubmit}>
          <div className="form__user">
            <div className="form__user--img">
              <img src={user.img} alt="aa" />
            </div>
            <div className="form__user--username">
              <h3>{user.username}</h3>
              {location && <span>{location}</span>}
            </div>
          </div>
          <div className="form__unit my-2">
            <div className="form__unit features">
              <textarea
                value={title}
                name="body"
                onChange={handleChange}
                placeholder="what in your mind..?"
              ></textarea>
              <PostImage
                previewUrl={previewUrl}
                removeImage={removeImage}
                setImgData={setCropData}
              />
              <div className="features__icons">
                <div className="features__icons--body">
                  <span className="icon" onClick={pickImageHandler}>
                    <input
                      ref={filePickerRef}
                      style={{ display: "none" }}
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={pickedHandler}
                    />
                    <Camera
                      width="2.2rem"
                      height="2.4rem"
                      fill={previewUrl ? "#1D8CF8" : "#8B8B85"}
                    />
                  </span>
                  <EmojyPicker
                    handleChange={addEmojy}
                    style={{
                      top: "-20rem",
                      left: "-20rem",
                    }}
                    className="emojy-picker"
                  />
                  <GetLocation
                    location={location}
                    handleLocation={(city) => {
                      location ? setLocation(null) : setLocation(city);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            disabled={loading}
            className="btn btn--contained1-primary mg-none"
          >
            {loading ? "Posting...." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
});
export default PostForm;
