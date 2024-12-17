import { useState, useEffect } from 'react';
import { getCoordsOfCity, getWeatherData } from '../services/WeatherService';
import PropTypes from 'prop-types';

const WeatherSearch = ({ destination, setWeather, startDate, endDate }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [limitedForecast, setLimitedForecast] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            setError('');
            try {
                const coords = await getCoordsOfCity(destination);
                const weather = await getWeatherData(coords, 16);
                setWeatherData(weather);
                setWeather(weather);

                const start = new Date(startDate);
                const end = new Date(endDate);
                const today = new Date();
                const maxForecastDate = new Date(today);
                maxForecastDate.setDate(today.getDate() + 16);

                if (end > maxForecastDate) {
                    setLimitedForecast(true);
                } else {
                    setLimitedForecast(false);
                }
            } catch (err) {
                setError(`Error: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (destination) {
            fetchWeather();
        }
    }, [destination, setWeather, startDate, endDate]);

    const filterWeatherData = () => {
        if (!weatherData) return [];

        const start = new Date(startDate);
        const end = new Date(endDate);
        return weatherData.daily.time.filter((date, index) => {
            const forecastDate = new Date(date);
            return forecastDate >= start && forecastDate <= end;
        }).map((date, index) => ({
            date,
            maxTemp: weatherData.daily.temperature2mMax[index],
            minTemp: weatherData.daily.temperature2mMin[index]
        }));
    };

    const filteredWeatherData = filterWeatherData();

    return (
        <div>
            <h2>Weather Information for {destination}</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {limitedForecast && <p>Due to API limitations we can only provide 16 days of forecasts from today</p>}
            {filteredWeatherData.length > 0 && (
                <div>
                    <h3>Weather Forecast</h3>
                    <ul>
                        {filteredWeatherData.map((data, index) => (
                            <li key={index}>
                                <p>{new Date(data.date).toDateString()}</p>
                                <p>Max Temp: {Math.floor(data.maxTemp)}°C</p>
                                <p>Min Temp: {Math.floor(data.minTemp)}°C</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

WeatherSearch.propTypes = {
    destination: PropTypes.string.isRequired,
    setWeather: PropTypes.func.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired
};

export default WeatherSearch;