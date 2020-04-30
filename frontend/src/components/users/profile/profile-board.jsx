import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Place,
  Camera,
  User,
  Birth,
  Home_3 as Home,
} from "../../../assets/icons/icons";
import Loading from "../../../shared/loading.js";
import LoadingPage from "../../../shared/models/loading-modal";
import ErrorModal from "../../../shared/models/error-model";
import { useFetch } from "../../../shared/hooks/useFetch";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ProfileBoard = React.memo(({ user, isProfile, img, setImg }) => {
  const { loading, request, error, clearError } = useFetch();
  const filePickerRef = useRef();
  const CropperRef = useRef(0);
  const [crop, setCrop] = useState(false);
  const [files, setFiles] = useState();

  const pickedHandler = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFiles(pickedFile);
    }
  };
  const previewImg = async () => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setCrop(fileReader.result);
    };
    fileReader.readAsDataURL(files);
  };
  const changeImg = async (imgData) => {
    const dataset = JSON.parse(localStorage.getItem("userData2"));
    const payload = new FormData();
    payload.append("x", imgData.x);
    payload.append("y", imgData.y);
    payload.append("width", imgData.width);
    payload.append("height", imgData.height);
    payload.append("img", files);
    try {
      const respond = await request(
        process.env.REACT_APP_BACKEND_URL + `/users/img/${user._id}`,
        "post",
        payload,
        {
          Authorization: "Bearer " + user.token,
        }
      );
      setImg(respond.data.img);
      localStorage.setItem(
        "userData2",
        JSON.stringify({
          ...dataset,
          img: respond.data.img,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (!files) {
      return;
    }
    previewImg();
    // changeImg();
  }, [files]);

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div>
      {loading && <LoadingPage />}
      {crop && (
        <div className="modal__container">
          <div className="modal">
            <div
              className="modal__body cropper"
              onClick={(e) => e.stopPropagation()}
            >
              <Cropper
                ref={CropperRef}
                src={crop}
                style={{ height: "80vh", width: "100%" }}
                // Cropper.js options
                zoomable={false}
                aspectRatio={1}
                viewMode={2}
                responsive={true}
                guides={false}
              />
              <div className="modal__footer">
                <button
                  className="btn btn--outlined-danger"
                  onClick={() => setCrop(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn--contained-success"
                  onClick={() => {
                    setCrop(null);
                    changeImg(CropperRef.current.cropper.getData());
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && (
        <ErrorModal
          message="there was a problem with the image!"
          closeModal={clearError}
        />
      )}
      <div
        className="profile__cover"
        style={{
          backgroundImage: `url(${
            user.cover
              ? user.cover
              : "https://cdn.dribbble.com/users/648922/screenshots/9157929/media/e5d45686a9feeefaff2780443188a2d8.png"
          })`,
        }}
      ></div>
      <div className="profile__row">
        {isProfile && (
          <input
            ref={filePickerRef}
            style={{ display: "none" }}
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={pickedHandler}
          />
        )}
        <div className="profile__info">
          <div
            className="profile__info__picture"
            title="Change your image"
            style={{ cursor: `${isProfile ? "pointer" : "default"}` }}
            onClick={isProfile ? pickImageHandler : null}
          >
            <img src={img || user.img} alt="aa" />
            {isProfile && (
              <div className="profile__info__picture--icon">
                <Camera fill="#fff" width="2rem" height="2rem" />
              </div>
            )}
          </div>
          <h2 className="profile__info__username">{user.username}</h2>
          <h2 className="profile__info__name">{user.name}</h2>
        </div>
        <div className="profile__info__statics">
          <div className="profile__info__statics--head">
            <h3>posts</h3>
            <h3>chat Friends</h3>
          </div>
          <div className="seprator" />
          <div className="profile__info__statics--result">
            <h3>{user.posts.length}</h3>
            <h3>{user.chatRooms.length}</h3>
          </div>
          {user.about && user.about.bio && (
            <p className="profile__info__bio">{user.about.bio}</p>
          )}
        </div>
      </div>
      <div className="profile__about">
        <h2>About</h2>
        <div className="seprator" />
        <div className="profile__about__field">
          <div className="profile__about__field__quest">
            <Clock />
            <h4>Joined at </h4>
          </div>
          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        {user.about && user.about.livesIn && (
          <div className="profile__about__field">
            <div className="profile__about__field__quest">
              <Place />
              <h4>lives in</h4>
            </div>
            <p>{user.about.livesIn}</p>
          </div>
        )}
        {user.about && user.about.from && (
          <div className="profile__about__field">
            <div className="profile__about__field__quest">
              <Home />
              <h4>from</h4>
            </div>
            <p>{user.about.from}</p>
          </div>
        )}
        {user.about && user.about.birth && (
          <div className="profile__about__field">
            <div className="profile__about__field__quest">
              <Birth />
              <h4>was born on</h4>
            </div>
            <p>{user.about.birth}</p>
          </div>
        )}
        {user.about && user.about.gender && (
          <div className="profile__about__field">
            <div className="profile__about__field__quest">
              <User />
              <h4>gender </h4>
            </div>

            <p>{user.about.gender}</p>
          </div>
        )}
      </div>
    </div>
  );
});
export default ProfileBoard;
