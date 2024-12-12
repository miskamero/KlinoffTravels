import React, { useState, useEffect } from 'react';

const FetchIATA = ({ cityName, countryName, setIataCode }) => {
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchIATA = async () => {
            try {
                console.log('Fetching IATA code for:', cityName, countryName);
                const response = await fetch(`/api/airports/city/${cityName}/country/${countryName}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('API response data:', data);

                if (data.skyId) {
                    setIataCode(data.skyId);
                    console.log(`IATA code for ${cityName}, ${countryName}: ${data.skyId}`);
                } else {
                    setError('Airport not found');
                    console.log('Airport not found for city:', cityName, 'country:', countryName);
                }
            } catch (err) {
                setError('Error fetching data');
                console.error('Error fetching data:', err);
            }
        };

        fetchIATA();
    }, [cityName, countryName, setIataCode]);

    return (
        <div>
            {error && <p>{error}</p>}
        </div>
    );
};

export default FetchIATA;