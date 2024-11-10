import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import rainy_icon from '../assets/rainy.png';
import snowy_icon from '../assets/snowy.png';
import sunny_icon from '../assets/sunny.png';
import thunder_icon from '../assets/thunder.png';
import cloudy_icon from '../assets/cloudy.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
  const inputRef=useRef()
  const [weatherData, setWeatherData] = useState(null);

  // Icon mapping with expanded codes
  const allIcons = {
    "01d": sunny_icon, "01n": sunny_icon,
    "02d": cloudy_icon, "02n": cloudy_icon,
    "03d": cloudy_icon, "03n": cloudy_icon,
    "04d": cloudy_icon, "04n": cloudy_icon,
    "09d": rainy_icon, "09n": rainy_icon,
    "10d": rainy_icon, "10n": rainy_icon,
    "11d": thunder_icon, "11n": thunder_icon,
    "13d": snowy_icon, "13n": snowy_icon  };

  const search = async (city) => {
    if(city===""){
      alert("Enter City Name");
      return;
    }
    try {
      console.log("API Key:", import.meta.env.VITE_WEATHER_API_KEY);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      
      // Log the icon code
      const iconCode = data.weather[0].icon;
      console.log("Icon code from API:", iconCode);

      const icon = allIcons[iconCode] || sunny_icon; // Use sunny_icon as default
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon
      });
    } catch (error) {
      console.error("API request failed:", error);
      setWeatherData(false);
    }
  };

  useEffect(() => {
    search("London");
  }, []);

  return (
    <div className='weather'>
      <div className='search-bar'>
        <input ref={inputRef} type='text' placeholder='Search' />
        <img src={search_icon} alt="search icon" onClick={()=>search(inputRef.current.value)} />
      </div>
      {weatherData?
      <>
      <img src={weatherData?.icon || sunny_icon} alt="weather icon" className='weather-icon' />
      <p className='temperature'>{weatherData ? `${weatherData.temperature}° C` : 'Loading...'}</p>
      <p className='location'>{weatherData?.location || 'Loading...'}</p>
      <div className="weather-data">
        <div className='col'>
          <img src={humidity_icon} alt="humidity icon" />
          <div>
            <p>{weatherData ? `${weatherData.humidity} %` : 'Loading...'}</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className='col'>
          <img src={wind_icon} alt="wind icon" />
          <div>
            <p>{weatherData ? `${weatherData.windSpeed} km/h` : 'Loading...'}</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
      </>
      
      :<></>}

      
    </div>
  );
};

export default Weather;
