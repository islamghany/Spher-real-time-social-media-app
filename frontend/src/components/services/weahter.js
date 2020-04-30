import React, { useState, useEffect } from "react";
import Loading from "../../shared/loading.js";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Sunrise,
  Humidity,
  Wind,
  Clouds,
  Pressure,
  Snow,
  Sunset,
  Map_2 as Map,
} from "../../assets/icons/icons";
const Weather = React.memo(() => {
  const [error, setError] = useState(null);
  const [data, setData] = useState();
  const user = useSelector((state) => state.currentUser);
  const geolocationSuccess = (pos) => {
    const { latitude, longitude } = pos.coords;
    const url =
      `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=` +
      process.env.REACT_APP_WEATHER_API_KEY;
    axios
      .get(url)
      .then(function (response) {
        setData(response.data.data[0]);
      })
      .catch(function (error) {
        setError(error.message);
      });
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
  const greeting = () => {
    var myDate = new Date();
    var hrs = myDate.getHours();
    if (hrs < 12) return "Good Morning";
    else if (hrs >= 12 && hrs <= 17) return "Good Afternoon";
    else if (hrs >= 17 && hrs <= 24) return "Good Evening";
  };

  useEffect(() => {
    currentLocation();
    document.title="Weather";
  }, []);
  const getTime = () => {
    let now = new Date();
    let h = now.getHours() + "",
      m = now.getMinutes() + "";
    return (
      (h.length === 1 ? "0" + h : h) + ":" + (m.length === 1 ? "0" + m : m)
    );
  };
  const renderCover = () => {
    var myDate = new Date();
    var hrs = myDate.getHours();
    if (hrs < 12 && hrs > 5)
      return "https://res.cloudinary.com/dmygcaifb/image/upload/v1585957040/weather/image_1_ycx9w0.png";
    else if (hrs >= 12 && hrs <= 17)
      return "https://res.cloudinary.com/dmygcaifb/image/upload/v1585957038/weather/5a16845d7fdc2e68b47245f57922b294_bgqbr9.jpg";
    else
      return "https://res.cloudinary.com/dmygcaifb/image/upload/v1585957041/weather/bcc9cabb9563793baa61e7f5e15cd32c_uywdu7.png";
  };
  if (error) {
    return (
      <div className="services">
        <div className="services__not-availble">{error}</div>
      </div>
    );
  } else if (data) {
    return (
      <div className="weather">
        <div className="weather__container">
          {data && (
            <div className="weather__body">
              <div className="weather__welcome__place">
                <span className="icon">
                  {" "}
                  <Map width="3rem" height="3rem" />
                </span>{" "}
                <h2 className="text">{data.city_name}</h2>
              </div>
              <div
                className="weather__header"
                style={{ backgroundImage: `url(${renderCover()})` }}
              >
                <h2 className="weather__header__deg">
                  {data.temp}
                  <sup>o</sup>
                </h2>

                <div className="weather__header__des">
                  <span className="icon">
                    <img
                      src={`https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png`}
                      alt=""
                    />
                  </span>
                  <h1 className="text">{data.weather.description}</h1>
                </div>
              </div>
              <div className="weather__content">
                <div className="weather__welcome">
                  <h2 className="weather__welcome__head">
                    {greeting()}, {user ? user.name : ""}
                  </h2>

                  <div className="weather__welcome__time">
                    <h2>{data.ob_time.split(" ")[0]}</h2>
                    <h2>{getTime()}</h2>
                  </div>
                </div>
                <div className="seprator"></div>

                <ul className="weather__content--list">
                  <li className="weather__content--item">
                    <div className="weather__content--info">
                      <span>
                        <Sunrise width="3rem" height="3rem" />
                      </span>
                      <h3>sunrise:</h3>
                    </div>
                    <h1>{data.sunrise}</h1>
                  </li>
                  <div className="seprator" />
                  <li className="weather__content--item">
                    <div className="weather__content--info">
                      <span>
                        <Sunset width="3rem" height="3rem" />
                      </span>
                      <h3>sunset:</h3>
                    </div>
                    <h1>{data.sunset}</h1>
                  </li>
                  <div className="seprator" />
                  <li className="weather__content--item">
                    <div className="weather__content--info">
                      <span>
                        <Clouds width="3rem" height="3rem" />
                      </span>
                      <h3>clouds:</h3>
                    </div>
                    <h1>{data.clouds}%</h1>
                  </li>
                  <div className="seprator" />
                  <li className="weather__content--item">
                    <div className="weather__content--info">
                      <span>
                        <Wind width="3rem" height="3rem" />
                      </span>
                      <h3>wind speed:</h3>
                    </div>
                    <h1>{data.wind_spd}m/s</h1>
                  </li>
                  <div className="seprator" />
                  <li className="weather__content--item">
                    <div className="weather__content--info">
                      <span>
                        <Humidity width="3rem" height="3rem" />
                      </span>
                      <h3>humidity:</h3>
                    </div>
                    <h1>{data.rh}%</h1>
                  </li>
                  <div className="seprator" />
                  <li className="weather__content--item">
                    <div className="weather__content--info">
                      <span>
                        <Pressure width="3rem" height="3rem" />
                      </span>
                      <h3>pressure:</h3>
                    </div>
                    <h1>{data.pres}mb</h1>
                  </li>
                  <div className="seprator" />
                  <li className="weather__content--item">
                    <div className="weather__content--info">
                      <span>
                        <Wind width="3rem" height="3rem" />
                      </span>
                      <h3>Snowfall:</h3>
                    </div>
                    <h1>{data.snow}mm/hr</h1>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="services">
      <Loading />
    </div>
  );
});
export default Weather;
