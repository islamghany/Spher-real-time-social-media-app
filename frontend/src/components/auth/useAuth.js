import React, { useState,useEffect } from "react";
import { useDispatch } from "react-redux";


export const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  
  const handleGetin = (info) => {
    const ExpirationDate = new Date(
      new Date().getTime() + 1000 * 60 * 60 * 24 * 30
    );
    dispatch({ type: "SIGN_IN" ,payload:info.token });
    dispatch({
      type: "USER_DATA_IN",
      payload: {
        ...info,
        expiration: ExpirationDate.toISOString(),
      },
    });
    localStorage.setItem(
      "userData2",
      JSON.stringify({
        ...info,
        expiration: ExpirationDate.toISOString(),
      })
    );
  };
  const handleGetout = () => {
    dispatch({ type: "SIGN_OUT" });
    dispatch({ type: "USER_DATA_OUT" });
    localStorage.removeItem("userData2");
  };
  const handleRefresh = () => {
    const data = JSON.parse(localStorage.getItem("userData2"));
    if (data && data.token) {
      if (new Date(data.expiration) > new Date()) {
      	dispatch({ type: "SIGN_IN" ,payload:data.token });
        dispatch({
          type: "USER_DATA_IN",
          payload: {
            ...data
          },
        });
      }
    }
    setLoading(false);
  };

  return { handleGetin, handleRefresh, handleGetout, loading };
};
