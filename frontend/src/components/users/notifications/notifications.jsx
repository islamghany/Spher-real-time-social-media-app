import React, { useEffect, useState } from "react";
import { Bell_2 as Bell } from "../../../assets/icons/icons.js";
import { useFetch } from "../../../shared/hooks/useFetch";
import { useDispatch, useSelector } from "react-redux";
import socket from "../../socket";
import Loading from "../../../shared/loading";
import RenderNotifications from "./render-notifications";

const Notifications = React.memo(({ uid, token }) => {
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const [unReadNotifications, setUnReadNotifications] = useState(0);
  const { request, loading, error } = useFetch();
  const [hasMore, setHasMore] = useState(true);
  const fetchNotifications = async () => {
    try {
      const response = await request(
        process.env.REACT_APP_BACKEND_URL +
          `/users/notifications/${uid}?skip=${notifications.length}`
      );
      if (response.data.notifications.length < 6) setHasMore(false);
      dispatch({
        type: "FETCH_NOTIFICATIONS",
        payload: response.data.notifications,
      });
      setUnReadNotifications(response.data.unReadNotifications);
    } catch (err) {
      console.log(err);
    }
  };
  const clearNotfy = async () => {
    if (unReadNotifications > 0) {
      try {
        await request(
          process.env.REACT_APP_BACKEND_URL + `/users/clear/${uid}`,
          "post",
          {},
          {
            Authorization: "Bearer " + token,
          }
        );
        setUnReadNotifications(0);
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    socket.on("action", (action) => {
      if (action.type === "ClIENT_SEND_NOTFY") {
        if (action.state === "REMOVE") {
          dispatch({
            type: "REMOVE_NOTIFY",
            payload: action.notify._id,
          });
        } else {
          setUnReadNotifications((e) => e + 1);
          dispatch({
            type: "ADD_NOTIFY",
            payload: action.notify,
          });
        }
      }
    });
    fetchNotifications();
  }, []);
  const handleClick = () => {};
  return (
    <div className="notifications">
      <div className="notifications__container">
        <div className="notifications__header">
          <span className="text h2">Notifications</span>
          <span
            className="icon"
            style={{ position: "relative" }}
            onClick={handleClick}
          >
            {unReadNotifications > 0 && (
              <span className="icon__sub">{unReadNotifications}</span>
            )}
            <Bell />
          </span>
        </div>
        <div className="notifications__body">
          {notifications && notifications.length ? (
            <ul className="notifications__list">
              <RenderNotifications
                clearNotfy={clearNotfy}
                notifications={notifications}
              />
              {hasMore && (
                <div className="has-more">
                  {" "}
                  <button
                    className="nude"
                    disabled={loading}
                    onClick={fetchNotifications}
                  >
                    {loading ? "Loading" : "Load more Notifications"}
                  </button>{" "}
                </div>
              )}
            </ul>
          ) : loading ? (
            <Loading />
          ) : null}
        </div>
      </div>
    </div>
  );
});
export default Notifications;
