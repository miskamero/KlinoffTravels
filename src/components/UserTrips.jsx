import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/UserTrips.scss';
import PropTypes from 'prop-types';

const UserTrips = ({ userId }) => {
    const [trips, setTrips] = useState([]);
    const apiUrl = "http://127.0.0.1:5001/api/";

    const fetchTrips = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}trips/${userId}`);
            setTrips(response.data || []);
        } catch (error) {
            console.error('Error fetching trips:', error);
        }
    }, [userId, apiUrl]);

    useEffect(() => {
        fetchTrips();
    }, [userId, fetchTrips]);

    const handleDeleteTrip = async (id) => {
        try {
            await axios.delete(`${apiUrl}trips/${id}`);
            fetchTrips();
        } catch (error) {
            console.error('Error deleting trip:', error);
        }
    };

    const formatFlightDetails = (flight) => {
        if (!flight) return 'None selected';
        const { legs, price } = flight;
        const legDetails = legs.map((leg, index) => (
            <div key={index} className="trip-section">
                <p><strong>Flight Number:</strong> {leg.segments[0].flightNumber}</p>
                <p><strong>Airline:</strong> {leg.carriers.marketing[0].name}</p>
                <p><strong>Departure:</strong> {leg.origin.displayCode} at {leg.departure}</p>
                <p><strong>Arrival:</strong> {leg.destination.displayCode} at {leg.arrival}</p>
                <p><strong>Duration:</strong> {leg.durationInMinutes} minutes</p>
            </div>
        ));
        return (
            <div>
                {legDetails}
                <p><strong>Price:</strong> {price.formatted}</p>
            </div>
        );
    };

    const formatHotelDetails = (hotel) => {
        if (!hotel) return 'None selected';
        return (
            <div className="trip-section">
                <p><strong>Name:</strong> {hotel.name}</p>
                <p><strong>Address:</strong> {hotel.address}</p>
                <p><strong>Phone:</strong> {hotel.phone}</p>
                <p><strong>Price Range:</strong> ${hotel.price_range_usd.min} - ${hotel.price_range_usd.max}</p>
                <p><strong>Rating:</strong> {hotel.rating}</p>
                <a href={hotel.link} target="_blank" rel="noopener noreferrer">View on TripAdvisor</a>
            </div>
        );
    };

    const formatAttractions = (attractions) => {
        if (!attractions || attractions.length === 0) return 'None selected';
        return (
            <ul className="trip-section">
                {attractions.map((attraction, index) => (
                    <li key={index}>{attraction.properties.name_international?.en || attraction.properties.name}</li>
                ))}
            </ul>
        );
    };

    return (
        <div id="userTripsContainer">
            <h2>My Trips</h2>
            <Link to="/new-trip" className="new-trip-link">Create New Trip</Link>
            <ul>
                {trips.map((trip) => {
                    const details = JSON.parse(trip.details);
                    return (
                        <li key={trip.id}>
                            <h3>{trip.trip_name}</h3>
                            <p><strong>Departure:</strong> {trip.departure_city} on {trip.departure_date}</p>
                            <p><strong>Arrival:</strong> {trip.arrival_city}</p>
                            {trip.return_date && <p><strong>Return:</strong> {trip.return_date}</p>}
                            <div>
                                <p><strong>Outbound Flight:</strong></p>
                                {formatFlightDetails(details.outbound_flight)}
                            </div>
                            <div>
                                <p><strong>Inbound Flight:</strong></p>
                                {formatFlightDetails(details.inbound_flight)}
                            </div>
                            <div>
                                <p><strong>Hotel:</strong></p>
                                {formatHotelDetails(details.hotel)}
                            </div>
                            <div>
                                <p><strong>Attractions:</strong></p>
                                {formatAttractions(details.attractions)}
                            </div>
                            <button onClick={() => handleDeleteTrip(trip.id)}>Delete</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

UserTrips.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default UserTrips;