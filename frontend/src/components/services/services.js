import React, {useEffect, useState } from "react";
import Weather from "./weahter";
import Salat from "./salat";
import Loading from "../../shared/loading.js";
import axios from "axios";

const Services = React.memo(() => {

  const [error, setError] = useState(null);
  const [data, setData] = useState();
  const geolocationSuccess = pos => {
    const { latitude, longitude } = pos.coords;
    const url = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=`+process.env.REACT_APP_WEATHER_API_KEY;
    axios
      .get(url)
      .then(function(response) {
        setData(response.data.data[0]);
      })
      .catch(function(error) {
        setError(error.message);
      });
  };
  const getErrorCode = err => {
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
  const geolocationFaliur = err => {
    setError(getErrorCode(err));
  };
  const currentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
        geolocationSuccess,
        geolocationFaliur
      );
    } else {
      console.log("your browser dosnot support geolocation");
    }
  };

  useEffect(() => {
    currentLocation();
  }, []);
  if (error) {
    return (
      <div className="services">
        <div className="services__not-availble">{error}</div>
      </div>
    );
  } else if (data) {
    return (
      <div className="services">
        <Weather data={data} />
        <Salat city={data.city_name} />
      </div>
    );
  }
  return (
    <div className="services">
      <Loading />
    </div>
  );
});
export default Services;
