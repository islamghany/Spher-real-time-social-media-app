import React, { useRef, useEffect, useState } from "react";
import { File } from "../../assets/icons/icons";
import Loading from "../../shared/loading.js";
import InfiniteScroll from "react-infinite-scroller";
import LightboxImages from "./image-previwer";
import Linkify from "react-linkify";
import ReactHtmlParser from "react-html-parser";

const CahtBody = React.memo(
  ({ messages, userId, isLoading, fetchRoomsMessages, hasMore, way }) => {
    const bodyRef = useRef(null);
    const [lastFetchDataLength, setLastFetchDataLength] = useState(0);
    const [lastHeight, setLastHeight] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const closeLightBox = () => {
      setIsOpen(false);
    };
    const getMessageDate = (date) => {
      const x = new Date(date)
        .toLocaleTimeString()
        .toString()
        .split(/[\s:]+/);
      return x[0] + ":" + x[1] + " " + x[3];
    };
    const handleFile = (text, fileLink) => {
      const x =
        '<a download="' +
        text +
        '" href="' +
        fileLink +
        '" target="_blank">' +
        text +
        "</a>";
      return ReactHtmlParser(x);
    };
    const getDate = (d) => {
      if (new Date().toLocaleDateString() === new Date(d).toLocaleDateString())
        return "today";
      else if ((new Date().getTime - new Date(d).getTime()) * 1000 * 3600 < 48)
        return "yesterday";
      return new Date(d).toDateString();
    };
    const compareDates = (x, y) => {
      return (
        new Date(x).toLocaleDateString() !== new Date(y).toLocaleDateString()
      );
    };
    const handleScroll = () => {
      if (
        bodyRef &&
        bodyRef.current &&
        bodyRef.current.scrollTop < 50 &&
        messages.length >= 20 &&
        hasMore &&
        lastFetchDataLength !== messages.length
      ) {
        setLastFetchDataLength(messages.length);
        setLastHeight(bodyRef.current.scrollHeight);
        fetchRoomsMessages();
      }
    };
    useEffect(() => {
      if (bodyRef && bodyRef.current) {
        if (way)
          bodyRef.current.scrollTop = bodyRef.current.scrollHeight - lastHeight;
        else bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    }, [messages.length]);
    let lastSender = null;
    let lastDate = null;
    let images = [];
    return (
      <div className="chat__body">
        <div
          className="chat__body__container"
          onScroll={handleScroll}
          ref={bodyRef}
        >
          {isLoading && (
            <div className="loding-more">
              <Loading />
            </div>
          )}
          {isOpen && (
            <LightboxImages images={images} closeLightBox={closeLightBox} />
          )}
          {messages.length > 0 &&
            messages.map((message, idx) => {
              if (idx > 0) lastSender = messages[idx - 1].user._id;
              if (idx !== 0 && compareDates(lastDate, message.createdAt))
                lastDate = message.createdAt;
              if (idx === 0) lastDate = message.createdAt;
              if (message.messageType === "image")
                images.push(message.fileLink);
              if (
                (message.user._id === undefined && message.user === userId) ||
                (message.user._id && message.user._id === userId)
              ) {
                return (
                  <div>
                    {(idx === 0 || lastDate === message.createdAt) && (
                      <div className="chat__body__divider">
                        {getDate(message.createdAt)}
                      </div>
                    )}
                    <div className="chat__body__sender" key={message._id}>
                      <div
                        className={`message-text ${
                          (message.user._id &&
                            message.user._id !== lastSender) ||
                          (!message.user._id && message.user !== lastSender)
                            ? "tail"
                            : ""
                        }`}
                      >
                        {message.messageType === "text" ? (
                          <span className="text">{message.text}</span>
                        ) : message.messageType === "image" ? (
                          <div className="message__img">
                            <img
                              onClick={() => setIsOpen(true)}
                              src={message.fileLink}
                              alt="sdfs"
                            />
                          </div>
                        ) : (
                          <div className="file">
                            <span className="file__icon">
                              <File />
                            </span>
                            <span className="file__text">
                              {handleFile(message.text, message.fileLink)}
                            </span>
                          </div>
                        )}
                        <span className="time">
                          {getMessageDate(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div>
                  {(idx === 0 || lastDate === message.createdAt) && (
                    <div className="chat__body__divider">
                      {getDate(message.createdAt)}
                    </div>
                  )}
                  <div className="chat__body__reciver" key={message._id}>
                    {lastSender !== message.user._id && (
                      <span className="chat__body__reciver__username">
                        {message.user.username}
                      </span>
                    )}
                    <div
                      className={`message-text ${
                        lastSender !== message.user._id ? "tail" : ""
                      }`}
                    >
                      {message.messageType === "text" ? (
                        <span className="text">{message.text}</span>
                      ) : message.messageType === "image" ? (
                        <div className="message__img">
                          <img
                            onClick={() => setIsOpen(true)}
                            src={message.fileLink}
                            alt="sdfs"
                          />
                        </div>
                      ) : (
                        <div className="file">
                          <span className="file__icon">
                            <File />
                          </span>
                          <span className="file__text">
                            {handleFile(message.text, message.fileLink)}
                          </span>
                        </div>
                      )}
                      <span className="time">
                        {getMessageDate(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
);
export default CahtBody;
