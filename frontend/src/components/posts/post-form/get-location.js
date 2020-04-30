import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Map } from "../../../assets/icons/icons.js";
import ErrorModal from "../../../shared/models/error-model";
import LoadingModal from "../../../shared/models/loading-modal";

const GetLocation = React.memo(({ handleLocation, location }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const geolocationSuccess = (pos) => {
    setLoading(true);
    const { latitude, longitude } = pos.coords;
    const url =
      `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=` +
      process.env.REACT_APP_WEATHER_API_KEY;
    axios
      .get(url)
      .then(function (response) {
        handleLocation(response.data.data[0].city_name);
      })
      .catch(function (error) {
        setError(error.message);
      });
    setLoading(false);
  };
  const getErrorCode = (err) => {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        return "You have to make location allow first!";
      case err.POSITION_UNAVAILABLE:
        return "POSITION_UNAVAILABLE";
      case err.TIMEOUT:
        return "TIMEOUT";
      default:
        return "UNKNOWN_ERROR";
    }
  };
  const geolocationFaliur = (err) => {
    setError(getErrorCode(err));
    setLoading(false);
  };
  const currentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        geolocationSuccess,
        geolocationFaliur
      );
    } else {
      console.log("your browser dosnot support geolocation");
    }
  };

  const cancleLocation = () => {
    handleLocation(null);
  };
  useEffect(() => {
    window.addEventListener("click", clearError);
    return () => window.removeEventListener("click", clearError);
  }, [clearError]);
  return (
    <>
      {loading && <LoadingModal />}
      {error && (
        <ErrorModal state="error" closeModal={clearError} message={error} />
      )}
      <span
        className="icon"
        onClick={location ? cancleLocation : currentLocation}
      >
        <Map
          width="2.2rem"
          height="2.4rem"
          fill={location ? "#1D8CF8" : "#8B8B85"}
        />
      </span>
    </>
  );
});
export default GetLocation;
