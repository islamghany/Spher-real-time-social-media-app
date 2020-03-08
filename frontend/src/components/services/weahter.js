import React  from 'react';
import {Sunrise,Humidity,Wind,Clouds,Pressure,Snow,Sunset} from '../../assets/icons/icons';
const Weather = ({data})=>{

   const getTime=()=>{
   	let now =new Date();
   	return now.getHours()+':'+now.getMinutes();
   }
	return <div className="weather">
	  <div className="weather__container">
      { data && <div className="weather__body">
         <div className="weather__header">
          <div className="weather__header--info">
           <div className="weather__header--des">
            <span className="icon">
             <img src={`https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png`} alt=""/>
            </span>
            <h1>{data.weather.description}</h1> 
            </div>
            <div className="weather__header--temp">
            <h1>{data.temp}<sup>o</sup>C</h1> 
            </div>
          </div>
           <div className="weather__header--place">
             <h1>{data.city_name}</h1> 
             <h2>{data.ob_time.split(' ')[0]}</h2>
             <h2>{getTime()}</h2>
           </div>
         </div>
         <div className="weather__content">
           <ul className="weather__content--list">
               <li className="weather__content--item">
                <div className="weather__content--info"><span><Sunrise width="3rem" height="3rem" /></span><h3>sunrise:</h3>
                </div>
                <h1>{data.sunrise}</h1>
               </li>  
                <li className="weather__content--item">
                <div className="weather__content--info"><span>
                <Sunset width="3rem" height="3rem" /></span><h3>sunset:</h3>
                </div>
                <h1>{data.sunset}</h1>
               </li><li className="weather__content--item">
                <div className="weather__content--info"><span>
                <Clouds width="3rem" height="3rem" /></span><h3>clouds:</h3>
                </div>
                <h1>{data.clouds}%</h1>
               </li><li className="weather__content--item">
                <div className="weather__content--info"><span>
                <Wind width="3rem" height="3rem" /></span><h3>wind speed:</h3>
                </div>
                <h1>{data.wind_spd}m/s</h1>
               </li>
               <li className="weather__content--item">
                <div className="weather__content--info"><span>
                <Humidity width="3rem" height="3rem" /></span><h3>humidity:</h3>
                </div>
                <h1>{data.rh}%</h1>
               </li>
               <li className="weather__content--item">
                <div className="weather__content--info"><span>
                <Pressure width="3rem" height="3rem" /></span><h3>pressure:</h3>
                </div>
                <h1>{data.pres}mb</h1>
               </li>  
               <li className="weather__content--item">
                <div className="weather__content--info"><span>
                <Wind width="3rem" height="3rem" /></span><h3>Snowfall:</h3>
                </div>
                <h1>{data.snow}mm/hr</h1>
               </li>     
               </ul>
         </div>
         
      </div>}
      </div>
	</div>
}
export default Weather;