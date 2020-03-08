import React, {
  useEffect, useState, useRef } from "react";
import Loading from "../../shared/loading.js";
import Loadingbig from "../../shared/models/loading-modal";
import ErrorModal from "../../shared/models/error-model";
import { Post, Camera } from "../../assets/icons/icons";
import { useDispatch } from "react-redux";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserSidebar = React.memo(({ data }) => {
  const { error, sendRequest, clearError } = useHttpClient();
  const filePickerRef = useRef();
  const [files, setFiles] = useState();
  const [loading, setLoading] = useState();
  const [user, setUser] = useState();
  const dispatch = useDispatch();

  const pickedHandler = event => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFiles(pickedFile);
    } 
  };
  const handlePost = async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL+`/users/${data._id}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + data.token
        }
      );
      setUser(responseData.user);
    } catch (err) {
      console.log(err, error, "jnjn");
    }
  };
  const changeImg =async () => {
    try {
      let previewUrl;
      setLoading(true);
      const fileReader = new FileReader();

      fileReader.onload = () => {
        previewUrl = fileReader.result;
      };
      fileReader.readAsDataURL(files);
      const formData = new FormData();
      formData.append("img", files);
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL+`/users/img/${data._id}`,
        "POST",
        formData,
        {
          Authorization: "Bearer " + user.token
        }
      );
      console.log(data)
      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...data,
          username:responseData.user.username,
          img: previewUrl
        })
      );
      dispatch({
        type: "USER_DATA_IN",
        payload: {
          ...data,
          username:responseData.user.username,
          img: previewUrl
        }
      });
      setUser(e => {
        return { ...e, img: previewUrl };
      });
     
    } catch (err) {
      console.log(err);
    }
     setLoading(false);
  };

  useEffect(() => {
    if (!files) {
      return;
    }
    changeImg();
  }, [files]);

  useEffect(() => {
    handlePost();
  }, []);

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  if (user) {
    return (
      <div className="sidebar">
        {loading && <Loadingbig />}
        {error && (
          <ErrorModal state="error" closeModal={clearError} message={error} />
        )}
        <div className="sidebar__container">
          <div className="sidebar__cover">
            <div className="sidebar__pp">
              <input
                ref={filePickerRef}
                style={{ display: "none" }}
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={pickedHandler}
              />
              <div className="sidebar__pp--wrapper">
                <div className="sidebar__pp--img" style={{
                	background:`url(${user.img[0] === "d" || user.img[0] ==='h'
                        ? user.img
                        : `data:image/png;base64,${user.img.toString("base64")}`})`,
                        backgroundSize:'cover',
                        backgrounPosition:'center center'
                }} onClick={pickImageHandler}>
                 
                </div>
                <div className="sidebar__pp--icon">
                  <Camera fill="#222" width="2rem" height="2rem" />
                </div>
              </div>
            </div>
          </div>
          <div className="sidebar__info">
            <div className="sidebar__info--name">{user.username}</div>
            <div className="sidebar__info--email">{user.email}</div>
            <div className="sidebar__info--post" title="Num of posts">
              <span className="icon">
                <Post width="4rem" height="4rem" />
              </span>
              <span className="nop">{user.posts.length}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="sidebar">
      <Loading />
    </div>
  );
});
export default UserSidebar;
