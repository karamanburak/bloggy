
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Box } from "@mui/material";



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
                dispatch(fetchFail());
                console.log(error);
            };
            window.navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        } catch (error) {
            dispatch(fetchFail())
            console.log(error);
        }
    }

    useEffect(() => {
        getWeatherCall()
    }, [])
    if (!weatherData) {
        return null;
    }



    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
                height: 70,
                color:  "neutral.light" 
            }}>
            <Box gap={2}>
                <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="" width="50px" />
            </Box>
            <Box fontWeight="bold">
                {weatherData.name}
            </Box>
                
            <Box variant="span" sx={{ display: "flex",padding:".4rem" }}>
                {Math.round(weatherData.main.temp)} <b><sup>°C</sup></b>
            </Box>

        </Box>
    );
}
