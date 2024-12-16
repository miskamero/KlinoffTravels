import { useState } from 'react';
import PropTypes from 'prop-types';
import { getCoordsOfCity, getWeatherData } from '../services/WeatherService';

const WeatherSearch = ({ forecastDays = 7 }) => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);

    const handleSearch = async () => {
        const coords = await getCoordsOfCity(city);
        const weatherData = await getWeatherData(coords, forecastDays);
        setWeatherData(weatherData);
    };

    return (
        <div>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name" />
            <button onClick={handleSearch}>Search</button>
            {weatherData && (
                <div>
                    <h2>Weather Data</h2>
                    {weatherData.daily.time.map((time, index) => (
                        <div key={index}>
                            <p>{time.toISOString().split("T")[0]}</p>
                            <p>Max Temp: {Math.round(weatherData.daily.temperature2mMax[index])}°C</p>
                            <p>Min Temp: {Math.round(weatherData.daily.temperature2mMin[index])}°C</p>
                            <p>Avg Temp: {Math.round((weatherData.daily.temperature2mMax[index] + weatherData.daily.temperature2mMin[index]) / 2)}°C</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

WeatherSearch.propTypes = {
    forecastDays: PropTypes.number,
};

export default WeatherSearch;