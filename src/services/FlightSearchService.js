import axios from 'axios';

const flightAPIUrl = "http://127.0.0.1:5000/api/";
const airlabsApiKey = '8bd89b9c-ab4c-4447-b39c-a8910eb4bc1c';
const skyscannerApiConfig = {
    method: 'get',
    url: 'https://Skyscanner.proxy-production.allthingsdev.co/search?adults=1',
    headers: { 
        'x-apihub-key': 'B2WyWLbT1J0rznbUYPmaB01waqAA70iydq29KCIGVoxDjvuWuA', 
        'x-apihub-host': 'Skyscanner.allthingsdev.co', 
        'x-apihub-endpoint': '1bffa651-8d6b-449d-a181-0d9f8e17b0ac'
    }
};

export const fetchIATA = async (city) => {
    const response = await axios.get(`${flightAPIUrl}/airports/city/${city}`);
    return response.data.find((airport) => airport.id !== null).iata;
};

export const searchFlights = async (departureCity, arrivalCity, departureDate) => {
    try {
        const depIATA = await fetchIATA(departureCity);
        const arrIATA = await fetchIATA(arrivalCity);

        const airlabsUrl = `https://airlabs.co/api/v9/schedules?api_key=${airlabsApiKey}&dep_iata=${depIATA}&arr_iata=${arrIATA}&limit=10`;
        const airlabsResponse = await axios.get(airlabsUrl);

        if (departureDate) {
            const skyscannerUrl = `${skyscannerApiConfig.url}&origin=${depIATA}&destination=${arrIATA}&departureDate=${departureDate}`;
            skyscannerApiConfig.url = skyscannerUrl;
            const skyscannerResponse = await axios.request(skyscannerApiConfig);
            skyscannerApiConfig.url = skyscannerUrl.split('&origin=')[0];

            return {
                airlabs: airlabsResponse.data.response,
                skyscanner: skyscannerResponse.data
            };
        }

        return {
            airlabs: airlabsResponse.data.response
        };
    } catch (err) {
        if (err.response) {
            throw new Error(`Error: ${err.response.status} - ${err.response.data.message}`);
        } else {
            throw new Error('Error fetching flight data');
        }
    }
};