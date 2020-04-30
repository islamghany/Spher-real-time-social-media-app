import React, { useState, useEffect, useRef } from "react";
import { Arrow, Attachment } from "../../assets/icons/icons";
import ChatInfo from "./chat-info";
import { useFetch } from "../../shared/hooks/useFetch";
import ErrorModal from "../../shared/models/error-model";
import Loading from "../../shared/models/loading-modal";

const CahtHeader = ({ roomInfo, token, userId, serverSendMessage }) => {
  const { loading, request, error, clearError } = useFetch();
  const filePickerRef = useRef(null);
  const [files, setFiles] = useState();
  const [info, setInfo] = useState(false);
  const CloseInfo = () => {
    setInfo(false);
  };
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const sendMessage = async (img) => {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("roomId", roomInfo._id);
      formData.append("img", img);
      const response = await request(
        process.env.REACT_APP_BACKEND_URL + "/messages/send",
        "post",
        formData,
        {
          Authorization: "Bearer " + token,
        }
      );
      serverSendMessage(response.data.message);
    } catch (err) {
      console.log(err);
    }
  };
  const pickedHandler = (event) => {
    if (event.target.files && event.target.files.length === 1) {
      sendMessage(event.target.files[0]);
    }
  };
  return (
    <div className="chat__messages__header">
      {error && (
        <ErrorModal state="error" closeModal={clearError} message={error} />
      )}
      {loading && <Loading />}
      {roomInfo && (
        <>
          <div className="chat__messages__header__user">
            <div className="chat__messages__header--img">
              <img src={roomInfo.chatIcon} alt="aa" />
            </div>
            <h2>{roomInfo.name}</h2>
          </div>
          <div className="chat__messages__header--options">
            <div className="icon" onClick={pickImageHandler}>
              <Attachment />
              <input
                ref={filePickerRef}
                style={{ display: "none" }}
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,.svg"
                onChange={pickedHandler}
              />
            </div>

            {info && (
              <div className="chat__room__wrapper" onClick={CloseInfo}>
                <ChatInfo CloseInfo={CloseInfo} roomId={roomInfo._id} />
              </div>
            )}
            <div
              className={`icon`}
              onClick={(e) => {
                e.stopPropagation();
                setInfo((e) => !e);
              }}
            >
              <Arrow />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default CahtHeader;

