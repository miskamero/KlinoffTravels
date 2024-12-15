import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/UserTrips.scss';
import PropTypes from 'prop-types';

const UserTrips = ({ userId }) => {
    const [trips, setTrips] = useState([]);
    const [tripName, setTripName] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [details, setDetails] = useState('');
    const apiUrl = "http://127.0.0.1:5001/api/"
    
    const fetchTrips = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}trips/${userId}`);
            setTrips(response.data || []);
        } catch (error) {
            console.error('Error fetching trips:', error);
            setTrips([]);
        }
    }, [userId, apiUrl, setTrips]);
    
        useEffect(() => {
            fetchTrips();
        }, [userId, fetchTrips]);
    
    const handleAddTrip = async (e) => {
        e.preventDefault();
        try {
            const newTrip = { user_id: userId, trip_name: tripName, departure_city: departureCity, arrival_city: arrivalCity, departure_date: departureDate, return_date: returnDate, details };
            await axios.post(`${apiUrl}trips`, newTrip);
            fetchTrips();
            setTripName('');
            setDepartureCity('');
            setArrivalCity('');
            setDepartureDate('');
            setReturnDate('');
            setDetails('');
        } catch (error) {
            console.error('Error adding trip:', error);
        }
    };

    const handleDeleteTrip = async (id) => {
        try {
            await axios.delete(`${apiUrl}trips/${id}`);
            fetchTrips();
        } catch (error) {
            console.error('Error deleting trip:', error);
        }
    };

    return (
        <div id="userTripsContainer">
            <h2>My Trips</h2>
            <form onSubmit={handleAddTrip}>
                <input type="text" value={tripName} onChange={(e) => setTripName(e.target.value)} placeholder="Trip Name" required />
                <input type="text" value={departureCity} onChange={(e) => setDepartureCity(e.target.value)} placeholder="Departure City" required />
                <input type="text" value={arrivalCity} onChange={(e) => setArrivalCity(e.target.value)} placeholder="Arrival City" required />
                <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
                <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Details"></textarea>
                <button type="submit">Add Trip</button>
            </form>
            <ul>
                {trips.map((trip) => (
                    <li key={trip.id}>
                        <h3>{trip.trip_name}</h3>
                        <p><strong>Departure:</strong> {trip.departure_city} on {trip.departure_date}</p>
                        <p><strong>Arrival:</strong> {trip.arrival_city}</p>
                        {trip.return_date && <p><strong>Return:</strong> {trip.return_date}</p>}
                        {trip.details && <p><strong>Details:</strong> {trip.details}</p>}
                        <button onClick={() => handleDeleteTrip(trip.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

UserTrips.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default UserTrips;