import { useState, useEffect } from 'react';
import { searchFlights } from '../services/FlightSearchService';
import '../styles/FlightSearch.scss';

const FlightSearch = () => {
    const [flights, setFlights] = useState([]);
    const [advancedFlights, setAdvancedFlights] = useState([]);
    const [error, setError] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');

    useEffect(() => {
        console.log('Advanced Flights:', advancedFlights);
    }, [advancedFlights]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFlights([]);
        setAdvancedFlights([]);

        try {
            const { airlabs, skyscanner } = await searchFlights(departureCity, arrivalCity, departureDate);
            setFlights(airlabs);
            if (skyscanner) {
                setAdvancedFlights(skyscanner);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div id="flightSearchContainer">
            <h2>Flight Search</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Departure Date:
                        <input
                            type="date"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Departure City:
                        <input
                            type="text"
                            value={departureCity}
                            onChange={(e) => setDepartureCity(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label>
                        Arrival City:
                        <input
                            type="text"
                            value={arrivalCity}
                            onChange={(e) => setArrivalCity(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Search</button>
            </form>
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
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No flights found</p>
                    )
                )}
            </div>
        </div>
    );
};

export default FlightSearch;