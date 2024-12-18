import { useState, useEffect } from 'react';
import { getAttractions } from '../services/AttractionSearchService';
import PropTypes from 'prop-types';

const AttractionSearch = ({ arrivalCity, onSelectAttraction }) => {
    const [attractions, setAttractions] = useState([]);
    const [selectedAttractions, setSelectedAttractions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!arrivalCity) return;

        const fetchAttractions = async () => {
            try {
                const attractions = await getAttractions(arrivalCity);
                setAttractions(attractions);
            } catch (error) {
                setError(`Error: ${error.message}`);
            }
        };

        fetchAttractions();
    }, [arrivalCity]);

    const handleSelectAttraction = (attraction) => {
        if (selectedAttractions.length < 3 && !selectedAttractions.includes(attraction)) {
            const newSelectedAttractions = [...selectedAttractions, attraction];
            setSelectedAttractions(newSelectedAttractions);
            onSelectAttraction(newSelectedAttractions);
        }
    };

    return (
        <>
            <h1>Attractions in {arrivalCity}</h1>
            {error && <p>{error}</p>}
            <ul>
                {attractions.map((attraction) => (
                    <li key={attraction.properties.id}>
                        <h2>{attraction.properties.name_international?.en || attraction.properties.name || 'No name available'}</h2>
                        <p>{attraction.properties.formatted || 'No address available'}</p>
                        <button onClick={() => handleSelectAttraction(attraction)} disabled={selectedAttractions.includes(attraction)}>
                            {selectedAttractions.includes(attraction) ? 'Selected' : 'Select Attraction'}
                        </button>
                    </li>
                ))}
            </ul>
            {selectedAttractions.length === 3 && <p>You have selected the maximum of 3 attractions.</p>}
        </>
    );
}

AttractionSearch.propTypes = {
    arrivalCity: PropTypes.string.isRequired,
    onSelectAttraction: PropTypes.func.isRequired
};

export default AttractionSearch;