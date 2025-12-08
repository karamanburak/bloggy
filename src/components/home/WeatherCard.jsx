import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

export default function WeatherCard() {
    const [weatherData, setWeatherData] = useState(null)
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')

    const savePositionToState = (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
    }

    const getWeatherCall = () => {
        try {
            const successCallback = async (position) => {
                savePositionToState(position);
                const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${import.meta.env.VITE_WEATHER_apiKey}`);
                setWeatherData(data);
            };
            const errorCallback = (error) => {
                // Error handling
            };
            window.navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } catch (error) {
            // Error handling
        }
    }

    useEffect(() => {
        getWeatherCall()
    }, [])
    
    if (!weatherData) {
        return null;
    }

    return (
        <div className="flex justify-evenly items-center h-[70px] text-gray-100">
            <div className="flex gap-2">
                <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="" width="50px" />
            </div>
            <div className="font-bold">
                {weatherData.name}
            </div>
            <div className="flex p-1">
                {Math.round(weatherData.main.temp)} <b><sup>°C</sup></b>
            </div>
        </div>
    );
}
