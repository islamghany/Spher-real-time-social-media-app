import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../shared/loading.js";
import { Map_2 as Map } from "../../assets/icons/icons";

const Salat = ({ city }) => {
  const instance = axios.create({
    baseURL: `https://muslimsalat.p.rapidapi.com/${city}.json`,
    headers: {
      "x-rapidapi-host": "muslimsalat.p.rapidapi.com",
      "x-rapidapi-key": process.env.REACT_APP_SALAT_API_KEY
    }
  });
  const [data, setData] = useState(null);
  const getTime = () => {
    let now = new Date();
    let h = now.getHours() + "",
      m = now.getMinutes() + "";
    return (
      (h.length === 1 ? "0" + h : h) + ":" + (m.length === 1 ? "0" + m : m)
    );
  };
  const getReal = e => {
    let arr = e.split(" ");
    let h = e[0];
    let m;

    if (e[1] === ":") {
      h = arr[1] === "am" ? "0" + h : (parseInt(h) + 12).toString();
      if (e[3] === " ") m = 0 + e[2];
      else m = e[2] + e[3];
    } else {
      h += e[1];
      if (e[4] === " ") m = 0 + e[3];
      else m = e[3] + e[4];
    }

    return h + ":" + m;
  };
  const getNextSalat = () => {
    const time = getTime();
    const s = Object.values(data.items[0]);

    let i = 1;
    while (i < 6) {
      const azan = getReal(s[i]);
      if (azan > time) return i;
      i++;
    }
    return 1;
  };
  useEffect(() => {
    instance
      .get()
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.log("eer", err);
      });
  }, []);
  if (data) {
    const idx = getNextSalat();
    let items = Object.keys(data.items[0]);
    const times = Object.values(data.items[0]);
    return (
      <div className="salat">
        <div className="salat__main">
          <div className="salat__header">
            <span className="icon">
              <Map width="3rem" height="3rem" />
            </span>
            <span className="title">{data.title}</span>
          </div>
          <div className="salat__dashboard">
            <div className="salat__dashboard--time">{getTime()}</div>
            <div className="salat__dashboard--last-salat">
              {idx === 1 ? "Isha" : items[idx - 1]}
            </div>
          </div>
        </div>
        <div className="salat__times">
          <div className="salat__times--today">{data.items[0].date_for}</div>
          <ul className="salat__times--list">
            <li className={idx === 1 ? "active" : ""}>
              <span className="salat-name">Fajr</span>{" "}
              <span className="time">{getReal(times[1])} AM</span>
            </li>
            <li className={idx === 2 ? "active" : ""}>
              <span className="salat-name">Shurooq</span>{" "}
              <span className="time">{getReal(times[2])} AM</span>
            </li>
            <li className={idx === 3 ? "active" : ""}>
              <span className="salat-name">Dhuhr</span>{" "}
              <span className="time">
                {getReal(times[3])} {getReal(times[3])[1] !== "2" ? "AM" : "PM"}{" "}
              </span>
            </li>
            <li className={idx === 4 ? "active" : ""}>
              <span className="salat-name">Asr</span>{" "}
              <span className="time">{getReal(times[4])} PM</span>
            </li>
            <li className={idx === 5 ? "active" : ""}>
              <span className="salat-name">Maghrib</span>{" "}
              <span className="time">{getReal(times[5])} AM</span>
            </li>
            <li className={idx === 6 ? "active" : ""}>
              <span className="salat-name">Isha</span>{" "}
              <span className="time">{getReal(times[6])} AM</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className="salat">
      {" "}
      <Loading />
    </div>
  );
};
export default Salat;
