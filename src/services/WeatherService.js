import { fetchWeatherApi } from 'openmeteo';

const cityAPIUrl = "http://127.0.0.1:5002/api/";

export const getCoordsOfCity = async (city) => {
    const response = await fetch(`${cityAPIUrl}coords/${city}`);
    const data = await response.json();
    return data;
};

export const getWeatherData = async (coords, forecastDays) => {
    const params = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        daily: ["temperature_2m_max", "temperature_2m_min"],
        timezone: "auto",
        forecast_days: forecastDays
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const range = (start, stop, step) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const daily = response.daily();

    const weatherData = {
        daily: {
            time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2mMax: daily.variables(0).valuesArray(),
            temperature2mMin: daily.variables(1).valuesArray(),
        },
    };

    return weatherData;
};