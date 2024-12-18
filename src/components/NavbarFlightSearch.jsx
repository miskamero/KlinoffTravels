import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { searchFlights, fetchIATA } from '../services/FlightSearchService';
import PropTypes from 'prop-types';
import '../styles/NavbarFlightSearch.scss';

const PEXELS_API_KEY = 'ILqm2Q5HOcAUgoFxX4hiIJ0aNHTdwUgDVyg6hqjvs7YpfDIMVZXOUW87';

const NavbarFlightSearch = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const destinationCity = queryParams.get('destination');

    const [flights, setFlights] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [cityImages, setCityImages] = useState({});
    const popularCities = useMemo(() => [
        "London", "Paris", "Berlin", "New York", "Tokyo", "Sydney", "Dubai", "Rome", "Barcelona", "Amsterdam",
        "Los Angeles", "San Francisco", "Chicago", "Miami", "Toronto", "Vancouver"
    ], []);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchFlights = async (depCity) => {
            setError('');
            setFlights([]);
            setLoading(true);
            console.log(`Fetching flights from ${depCity} to ${destinationCity}`);

            try {
                const departureDate = new Date().toISOString().split('T')[0];
                const { airlabs } = await searchFlights(depCity, destinationCity, departureDate);
                const currentTime = new Date();
                const filteredAirlabs = airlabs.filter(flight => new Date(flight.dep_time) > currentTime);
                console.log('Filtered flights:', filteredAirlabs);
                setFlights(filteredAirlabs);
            } catch (err) {
                console.error('Error fetching flights:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const getUserLocation = () => {
            return new Promise((resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            });
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                } else {
                    reject(new Error('Geolocation is not supported by this browser.'));
                }
            });
        };

        const getDepartureCity = async () => {
            try {
                const userLocation = await getUserLocation();
                const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&localityLanguage=en`);
                const data = await response.json();
                const city = data.city || 'Helsinki';
                const depIATA = await fetchIATA(city);
                return depIATA ? city : 'Helsinki';
            } catch {
                return 'Helsinki';
            }
        };

        if (destinationCity) {
            getDepartureCity().then(depCity => fetchFlights(depCity));
        }
    }, [destinationCity]);

    useEffect(() => {
        const fetchCityImages = async () => {
            const images = {};
            for (const city of popularCities) {
                try {
                    const response = await fetch(`https://api.pexels.com/v1/search?query=${city}&per_page=1`, {
                        headers: {
                            Authorization: PEXELS_API_KEY
                        }
                    });
                    const data = await response.json();
                    images[city] = data.photos[0].src.medium;
                } catch {
                    images[city] = 'https://via.placeholder.com/150'; // Fallback image
                }
            }
            setCityImages(images);
        };

        fetchCityImages();
    }, [popularCities]);

    const getRandomCities = (cities, count) => {
        const shuffled = cities.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const randomPopularCities = getRandomCities(popularCities, 3);

    const scrollLeft = () => {
        scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    return (
        <div className="navbar-flight-search-container">
            <div className="popular-destinations">
                <h2>Popular Destinations</h2>
                <div className="scroll-buttons">
                    <button onClick={scrollLeft}>&lt;</button>
                    <button onClick={scrollRight}>&gt;</button>
                </div>
                <div className="popular-destinations-scroll" ref={scrollContainerRef}>
                    <ul>
                        <li>
                            <img src={cityImages['London']} alt="London" />
                            <p>London</p>
                        </li>
                        <li>
                            <img src={cityImages['Paris']} alt="Paris" />
                            <p>Paris</p>
                        </li>
                        <li>
                            <img src={cityImages['Berlin']} alt="Berlin" />
                            <p>Berlin</p>
                        </li>
                        {randomPopularCities.map((city, index) => (
                            <li key={index}>
                                <img src={cityImages[city]} alt={city} />
                                <p>{city}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <h2>Search Results</h2>
            {error && <p className="error">{error}</p>}
            <div className="results">
                {loading ? (
                    <p>Searching...</p>
                ) : flights && flights.length > 0 ? (
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
                    <p>No results</p>
                )}
            </div>
        </div>
    );
};

NavbarFlightSearch.propTypes = {
    destinationCity: PropTypes.string
};

export default NavbarFlightSearch;