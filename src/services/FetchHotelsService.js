import axios from 'axios';

const tripadvisorApiConfig = {
    method: 'GET',
    url: 'https://tripadvisor-scraper.p.rapidapi.com/hotels/list',
    headers: {
        'x-rapidapi-key': 'f236296ef0msh656e9a274a63e9ep12c7cfjsn42a2f740ad7a',
        'x-rapidapi-host': 'tripadvisor-scraper.p.rapidapi.com'
    }
};

export const fetchHotels = async (searchQuery) => {
    try {
        const response = await axios.request({
            ...tripadvisorApiConfig,
            params: {
                query: searchQuery,
                page: '1'
            }
        });

        return response.data.results || [];
    } catch (err) {
        throw new Error(`Unable to fetch hotel data, ${err}. Please try again later.`);
    }
};