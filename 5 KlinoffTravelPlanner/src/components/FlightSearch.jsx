import { useState } from 'react';
import axios from 'axios';
import FetchIATA from './FetchIATA';

const FlightSearch = () => {
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [departureCountry, setDepartureCountry] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [arrivalCountry, setArrivalCountry] = useState('');
    const [departureIATA, setDepartureIATA] = useState('');
    const [arrivalIATA, setArrivalIATA] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setFlights([]);

        try {
            const airlabsApiKey = '8bd89b9c-ab4c-4447-b39c-a8910eb4bc1c';
            let url = `https://airlabs.co/api/v9/schedules?api_key=${airlabsApiKey}&dep_iata=${departureIATA}&arr_iata=${arrivalIATA}`;
            if (departureDate) {
                url += `&date=${departureDate}`;
            } else {
                url += `&limit=10`;
            }

            const options = {
                method: 'GET',
                url: url,
            };

            const response = await axios.request(options);
            console.log('Response:', response);

            if (response.status === 200 && response.data.response) {
                setFlights(response.data.response);
            } else {
                setError(`Error: Received status code ${response.status}`);
            }
        } catch (err) {
            console.error('API Error:', err);
            if (err.response) {
                setError(`Error: ${err.response.status} - ${err.response.data.message}`);
            } else {
                setError('Error fetching flight data');
            }
        }
    };

    return (
        <div>
            <h2>Flight Search</h2>
            <form onSubmit={handleSearch}>
                <div>
                    <label>
                        Departure Date:
                        <input
                            type="date"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Departure City:
                        <input
                            type="text"
                            value={departureCity}
                            onChange={(e) => setDepartureCity(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Departure Country:
                        <input
                            type="text"
                            value={departureCountry}
                            onChange={(e) => setDepartureCountry(e.target.value)}
                            required
                        />
                    </label>
                    <FetchIATA cityName={departureCity} countryName={departureCountry} setIataCode={setDepartureIATA} />
                </div>
                <div>
                    <label>
                        Arrival City:
                        <input
                            type="text"
                            value={arrivalCity}
                            onChange={(e) => setArrivalCity(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Arrival Country:
                        <input
                            type="text"
                            value={arrivalCountry}
                            onChange={(e) => setArrivalCountry(e.target.value)}
                            required
                        />
                    </label>
                    <FetchIATA cityName={arrivalCity} countryName={arrivalCountry} setIataCode={setArrivalIATA} />
                </div>
                <button type="submit">Search</button>
            </form>
            {error && <p>{error}</p>}
            <div>
                {flights && flights.length > 0 ? (
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
                )}
            </div>
        </div>
    );
};

export default FlightSearch;