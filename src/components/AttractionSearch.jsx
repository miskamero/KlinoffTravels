import { useState } from 'react';
import { getAttractions } from '../services/AttractionSearchService';

const AttractionSearch = () => {
    const [attractions, setAttractions] = useState([]);
    const [error, setError] = useState('');
    const [city, setCity] = useState('');

    const fetchAttractions = async (city) => {
        try {
            const attractions = await getAttractions(city);
            setAttractions(attractions);
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };

    return (
        <>
            <h1>Attractions</h1>
            <input
                type="text"
                placeholder="Enter a city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={() => fetchAttractions(city)}>Search</button>
            {error && <p>{error}</p>}
            <ul>
                {attractions.map((attraction) => (
                    <li key={attraction.properties.id}>
                        <h2>{attraction.properties.name_international?.en || attraction.properties.name || 'No name available'}</h2>
                        <p>{attraction.properties.formatted || 'No address available'}</p>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default AttractionSearch;