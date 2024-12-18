import { useState, useEffect } from 'react';
import { searchFlights } from '../services/FlightSearchService';
import PropTypes from 'prop-types';
import '../styles/FlightSearch.scss';

const FlightSearch = ({
    departureDate = new Date().toISOString().split('T')[0],
    departureCity = '',
    arrivalCity = '',
    onSelectFlight,
    isOutbound = true
}) => {
    const [flights, setFlights] = useState([]);
    const [advancedFlights, setAdvancedFlights] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFlights = async () => {
            setError('');
            setFlights([]);
            setAdvancedFlights([]);

            try {
                const { airlabs, skyscanner } = await searchFlights(departureCity, arrivalCity, departureDate);
                const currentTime = new Date();
                const filteredAirlabs = airlabs.filter(flight => new Date(flight.dep_time) > currentTime);
                setFlights(filteredAirlabs);
                if (skyscanner && new Date(departureDate) > currentTime) {
                    const filteredSkyscanner = skyscanner.itineraries.buckets.map(bucket => ({
                        ...bucket,
                        items: bucket.items.filter(item => new Date(item.legs[0].departure) > currentTime)
                    }));
                    setAdvancedFlights({ ...skyscanner, itineraries: { ...skyscanner.itineraries, buckets: filteredSkyscanner } });
                }
            } catch (err) {
                setError(err.message);
            }
        };

        if (departureCity && arrivalCity && departureDate) {
            fetchFlights();
        }
    }, [departureCity, arrivalCity, departureDate]);

    return (
        <div id="flightSearchContainer">
            <h2>{isOutbound ? 'Outbound Flight Search' : 'Inbound Flight Search'}</h2>
            {error && <p className="error">{error}</p>}
            <div className="results">
                {advancedFlights && advancedFlights.itineraries && advancedFlights.itineraries.buckets && advancedFlights.itineraries.buckets.length > 0 ? (
                    <ul>
                        {advancedFlights.itineraries.buckets.map((bucket) =>
                            bucket.items.map((item, index) => (
                                <li key={index}>
                                    <p><strong>Flight Number:</strong> {item.legs[0].segments[0].flightNumber}</p>
                                    <p><strong>Airline:</strong> {item.legs[0].carriers.marketing[0].name}</p>
                                    <p><strong>Departure:</strong> {item.legs[0].origin.displayCode} at {item.legs[0].departure}</p>
                                    <p><strong>Arrival:</strong> {item.legs[0].destination.displayCode} at {item.legs[0].arrival}</p>
                                    <p><strong>Duration:</strong> {item.legs[0].durationInMinutes} minutes</p>
                                    <button onClick={() => onSelectFlight(item)}>Select Flight</button>
                                </li>
                            ))
                        )}
                    </ul>
                ) : (
                    flights && flights.length > 0 ? (
                        <ul>
                            {flights.map((flight, index) => (
                                <li key={index}>
                                    <p><strong>Flight Number:</strong> {flight.flight_iata}</p>
                                    <p><strong>Airline:</strong> {flight.airline_iata}</p>
                                    <p><strong>Departure:</strong> {flight.dep_iata} at {flight.dep_time} (Gate: {flight.dep_gate}, Terminal: {flight.dep_terminal})</p>
                                    <p><strong>Arrival:</strong> {flight.arr_iata} at {flight.arr_time} (Gate: {flight.arr_gate}, Terminal: {flight.arr_terminal})</p>
                                    <p><strong>Status:</strong> {flight.status}</p>
                                    <p><strong>Duration:</strong> {flight.duration} minutes</p>
                                    {flight.delayed && <p><strong>Delayed:</strong> {flight.delayed} minutes</p>}
                                    <button onClick={() => onSelectFlight(flight)}>Select Flight</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Loading...</p>
                    )
                )}
            </div>
        </div>
    );
};

FlightSearch.propTypes = {
    departureDate: PropTypes.string,
    departureCity: PropTypes.string,
    arrivalCity: PropTypes.string,
    onSelectFlight: PropTypes.func.isRequired,
    isOutbound: PropTypes.bool
};

export default FlightSearch;