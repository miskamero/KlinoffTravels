import { useState } from 'react';
import axios from 'axios';

const FlightSearch = () => {
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');

    const fetchIATA = async (city) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/airports/city/${city}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API response data:', data);
            // output the iata code of the object that id is not null
            return data.find((airport) => airport.id !== null).iata;
        } catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    };

    const handleSearch = async (depIATA, arrIATA) => {
        setError('');
        setFlights([]);

        try {
            console.log('Searching for flights:', depIATA, arrIATA, departureDate);
            console.log(`Dep date: ${departureDate}`);
            const airlabsApiKey = '8bd89b9c-ab4c-4447-b39c-a8910eb4bc1c';
            let url = `https://airlabs.co/api/v9/schedules?api_key=${airlabsApiKey}&dep_iata=${depIATA}&arr_iata=${arrIATA}`;
            if (departureDate) {
                url += `&dep_time=${departureDate}`;
            } else {
                url += `&limit=10`;
            }
            console.log('API URL:', url);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const depIATA = await fetchIATA(departureCity);
            const arrIATA = await fetchIATA(arrivalCity);
            await handleSearch(depIATA, arrIATA);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Flight Search</h2>
            <form onSubmit={handleSubmit}>
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