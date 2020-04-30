import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { useFetch } from "../../shared/hooks/useFetch";
import { useSelector } from "react-redux";
import socket from "../socket";
import { CSSTransition } from 'react-transition-group';

const primary = "#1d8cf8",
  second = "#949495";
const colourStyles = {
  control: (styles) => ({
    ...styles,
    color: "#fff",
    backgroundColor: "#333",
    fontSize: "1.6rem",
    minHeight: "5rem",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,

      backgroundColor: isSelected ? primary : "#fff",
      color: isSelected ? "#fff" : second,
      fontSize: "1.5rem",
      ":active": {
        ...styles[":active"],
        backgroundColor: isSelected ? primary : "#fff",
      },
      ":hover": {
        ...styles[":hover"],
        backgroundColor: primary,
        color: "#fff",
      },
    };
  },
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: second,
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: "#fff",
  }),
  input: (styles) => ({ ...styles, color: "#fff" }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    backgroundColor: "#ff3860",
    color: "white",
  }),
};

let timer;
const ChatForm = ({ dispatchRoom ,children}) => {
  const user = useSelector((state) => state.currentUser);
  const [isLoading, setIsLoading] = useState();
  const [members, setMembers] = useState();
  const [chatName, setChatName] = useState();
  const [membersError, setMembersError] = useState();
  const [chatNameError, setChatNameError] = useState();
  const [success, setSuccess] = useState();
  const [isOpen,setIsOpen]=useState(false);
 
  const closeModal = ()=>{
    if(isOpen){
      setIsOpen(false);
       document.body.style.overflowY='auto';
    }
  }
  const openModal=()=>{
    if(!isOpen){
      setIsOpen(true);
      document.body.style.overflowY='hidden';
    }
  }

  const { request, error } = useFetch();
  const FetchUser = async (input) => {
    try {
      const responsedData = await request(
        process.env.REACT_APP_BACKEND_URL + `/users?q=${input}&limit=7&id=${user._id}`
      );
      return responsedData.data.users;
    } catch (err) {
      console.log(err);
    }
  };

  const addChatRoom = async () => {
    const chatRoom = {
      name: chatName,
      members: [...members, { value: user._id, label: "hey" }],
    };
    try {
      setIsLoading(true);
      const response = await request(
        process.env.REACT_APP_BACKEND_URL + `/chat/create`,
        "post",
        chatRoom,
        {
          Authorization: "Bearer " + user.token,
        }
      );
      socket.emit("action", {
        members: [...members, { value: user._id, label: "hey" }],
        data: response.data.chatRoom,
        type: "CREATE_CAHT_ROOM",
      });
      dispatchRoom({ type: "ADD_ROOM", payload: response.data.chatRoom });
      setSuccess(true);
      closeModal();
    } catch (err) {
      console.log(err.response);
    }
    setIsLoading(false);
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        resolve(FetchUser(inputValue));
      }, 1000);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!members || !members.length) {
      setMembersError(true);
      return;
    }
    if (!chatName || !chatName.trim().length) {
      setChatNameError(true);
      return;
    } else {
      addChatRoom();
      setMembersError(false);
      setChatNameError(false);
    }
  };
  const onChange = (selectedOptions) => setMembers(selectedOptions);

  return (
    <>
    <div style={{display:'inline-block'}} onClick={openModal}>{children}</div>
      <CSSTransition
        in={isOpen}
        timeout={300}
        classNames="modal"
        unmountOnExit
      >
    <div className="modal__container" onClick={closeModal}>
      <div className="modal">
        <div className="chat__form" onClick={(e) => e.stopPropagation()}>
          <div className="chat__form__container">
            <form onSubmit={handleSubmit}>
              <div className="error-message">
                <div className="message">
                  {error ? error || "something went wrong" : ""}
                </div>
              </div>
              <div className="form__control">
                <div className="form__unit">
                  <AsyncSelect
                    cacheOptions
                    loadOptions={promiseOptions}
                    defaultOptions
                    name="members"
                    isMulti
                    onChange={onChange}
                    styles={colourStyles}
                  />
                </div>
                <div className="error-message">
                  <div className="message">
                    {membersError && "yout must add at least one person"}
                  </div>
                </div>
              </div>
              <div className="form__control">
                <div className="form__unit">
                  <input
                    placeholder=" "
                    type="text"
                    value={chatName}
                    className="form__input"
                    onChange={(e) => setChatName(e.target.value)}
                  />
                  <label className="form__label">Chat Room Name</label>
                </div>
                <div className="error-message">
                  <div className="message">
                    {chatNameError && "yout must name the chat"}
                  </div>
                </div>
              </div>

              <div className="chat__form--tail">
                <button
                  disabled={
                    isLoading ||
                    !members ||
                    !members.length ||
                    !chatName ||
                    !chatName.trim()
                  }
                  className="btn btn--contained1-default mg-none"
                >
                  {isLoading ? "Loading..." : "Create"}
                </button>
              </div>
            </form>
            {success && <h6>Your new room was created succfully</h6>}
          </div>
        </div>
      </div>
    </div>
    </CSSTransition>
    </>
  );
};
export default ChatForm;
