import axios from "axios";
import React, { useState,useEffect,useCallback } from "react";

export const useWeatherHook =()=>{
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const [location1,setLocation]=useState(null);
  const clearError=useCallback(()=>{
  	setError(null);
  },[])
  const geolocationSuccess =  pos => {
  	const {latitude,longitude} = pos.coords;
     setLoading(true)
     const url =`https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key`+process.env.REACT_APP_WEATHER_API_KEY;   
     axios.get(url)
  .then(function (response) {
    setLocation(response.data.data[0].city_name);
  })
  .catch(function (error) {
    setError(error.message);
  })
     setLoading(false)
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
  const currentLocation =  () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        geolocationSuccess,
        geolocationFaliur
      );
    } else {
      console.log("your browser dosnot support geolocation");
    }
  };

 return {error,clearError,loading,currentLocation,location1}
}