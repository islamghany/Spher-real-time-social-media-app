import React, { useState, useRef, useCallback, useEffect } from "react";
import { Camera, Delete } from "../../assets/icons/icons.js";
import Zoom from "react-reveal/Zoom";
import GetLocation from "./post-form/get-location";
import { useHttpClient } from "../../shared/hooks/http-hook";
import EmojyPicker from "./post-form/emojy-picker";
import ErrorModal from "../../shared/models/error-model";
import LoadingModal from "../../shared/models/loading-modal";
import {useDispatch} from 'react-redux';
const PostForm = React.memo(({ user }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();
  const [location, setLocation] = useState(null);
  const dispatch = useDispatch();
  const createPost = async data => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("location", data.location);
      formData.append("img", data.img);
      formData.append("creator", data.creator);
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL+"/posts",
        "POST",
        formData,
        {
          Authorization: "Bearer " + user.token
        }
      );
      dispatch({
        type: "CREATE_POST",
        payload: {
          ...responseData["post"],
          img: previewUrl,
          new: true,
          creator: {
            createdAt: new Date().toISOString(),
            username: user.username,
            img: user.img,
            _id: user.id
          }
        }
      });
      removeImage();
      setTitle("");
      setLocation(null);
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = e => {
    setTitle(e.target.value);
  };
  const addEmojy = e => {
    setTitle(el => el + e);
  };
  const handleSubmit = e => {
    e.preventDefault();
    createPost({ title, img: files, location, creator: user.id });
  };
  const removeImage = idx => {
    setFiles(null);
    setPreviewUrl(null);
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

  const pickedHandler = event => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFiles(pickedFile);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div className="form__container">
      {isLoading && <LoadingModal />}
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
            <div
              className="form__user--img"
              style={{
                background: `url(${
                  user.img[0] === "d" || user.img[0] === "h"
                    ? user.img
                    : `data:image/png;base64,${user.img.toString("base64")}`
                })`,
                backgroundSize: "cover",
                backgrounPosition: "center center"
              }}
            ></div>
            <div className="form__user--username">
              <h3>{user.username}</h3>
              {location && <span>{location}</span>}
            </div>
          </div>
          <div className="form__unit">
            <div className="form__unit features">
              <textarea
                value={title}
                name="body"
                onChange={handleChange}
                placeholder="what in your mind..?"
              ></textarea>
              {previewUrl ? (
                <div className="form__images--container">
                  <div className="form__images--row">
                    <Zoom>
                      <div className="img">
                        <div className="img-wrap">
                          <div className="close" onClick={() => removeImage()}>
                            <Delete width="2.5rem" height="2.5rem" />
                          </div>
                        </div>
                        <img src={previewUrl} alt="aa" />
                      </div>
                    </Zoom>
                  </div>
                </div>
              ) : null}
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
                  <EmojyPicker handleChange={addEmojy} />
                  <GetLocation
                    location={location}
                    handleLocation={city => {
                      location ? setLocation(null) : setLocation(city);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            disabled={isLoading}
            className="btn btn--contained1-primary mg-none"
          >
            {isLoading ? "Posting...." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
});
export default PostForm;
