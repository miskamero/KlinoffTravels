import { useState, useEffect } from 'react';
import axios from 'axios';
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

    const fetchIATA = async (city) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/airports/city/${city}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('API response data from IATA API:', data);
            // output the iata code of the object that id is not null
            return data.find((airport) => airport.id !== null).iata;
        } catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    };

    let advancedKlinoffApiConfig = {
        method: 'get',
        url: 'https://Skyscanner.proxy-production.allthingsdev.co/search?adults=1',
        headers: { 
            'x-apihub-key': 'B2WyWLbT1J0rznbUYPmaB01waqAA70iydq29KCIGVoxDjvuWuA', 
            'x-apihub-host': 'Skyscanner.allthingsdev.co', 
            'x-apihub-endpoint': '1bffa651-8d6b-449d-a181-0d9f8e17b0ac'
        }
    };

    const fetchAdvancedFlights = async (depIATA, arrIATA, departureDate) => {
        let baseUrl = advancedKlinoffApiConfig.url;
        let searchUrl = `${advancedKlinoffApiConfig.url}&origin=${depIATA}&destination=${arrIATA}&departureDate=${departureDate}`;
        advancedKlinoffApiConfig.url = searchUrl;
        console.log('API URL better api:', searchUrl);
        try {
            const response = await axios.request(advancedKlinoffApiConfig);
            console.log(JSON.stringify(response.data));
            if (response.status === 200) {
                setAdvancedFlights(response.data);
            } else {
                setError(`Error: Received status code ${response.status}`);
            }
        } catch (error) {
            console.error(error);
            setError('Error fetching advanced flight data');
        } finally {
            advancedKlinoffApiConfig.url = baseUrl;
        }
    };

    const handleSearch = async (depIATA, arrIATA) => {
        setError('');
        setFlights([]);
        setAdvancedFlights([]);

        try {
            console.log('Searching for flights:', depIATA, arrIATA, departureDate);
            console.log(`Dep date: ${departureDate}`);
            const airlabsApiKey = '8bd89b9c-ab4c-4447-b39c-a8910eb4bc1c';
            let url = `https://airlabs.co/api/v9/schedules?api_key=${airlabsApiKey}&dep_iata=${depIATA}&arr_iata=${arrIATA}&limit=10`;
            if (departureDate) {
                await fetchAdvancedFlights(depIATA, arrIATA, departureDate);
                return;
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