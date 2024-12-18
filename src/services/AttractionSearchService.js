import axios from 'axios';

const cityAPIUrl = "http://127.0.0.1:5002/api/";
const geoapifyAPIKey = "34464d8b6f4f477b9ed82fc65381c263";
const geoapifyBaseUrl = "https://api.geoapify.com/v2/places";

export const getCoordsOfCity = async (city) => {
    const response = await axios.get(`${cityAPIUrl}coords/${city}`);
    return response.data;
};

export const getAttractions = async (city, amountOfPlaces = 7, area = 4000) => {
    try {
        const coords = await getCoordsOfCity(city);
        const { latitude, longitude } = coords;
        const response = await axios.get(`${geoapifyBaseUrl}`, {
            params: {
                categories: 'entertainment',
                filter: `circle:${longitude},${latitude},${area}`,
                limit: amountOfPlaces,
                apiKey: geoapifyAPIKey
            }
        });
        return response.data.features;
    } catch (error) {
        throw new Error(`Error fetching attractions: ${error.message}`);
    }
};