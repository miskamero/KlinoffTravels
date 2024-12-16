import { useState, useEffect } from 'react';
import { fetchHotels } from '../services/FetchHotelsService';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import '../styles/HotelSearch.scss';

const HotelSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!searchQuery) return;

        const fetchHotelData = async () => {
            setLoading(true);
            setError(null);

            try {
                const hotelList = await fetchHotels(searchQuery);
                setHotels(hotelList);
            } catch (err) {
                setError(err.message);
                setHotels([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHotelData();
    }, [searchQuery]);

    const handleSearchByInput = () => {
        const cityName = document.getElementById('cityName').value;
        if (cityName) {
            setSearchQuery(cityName);
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {Array.from({ length: fullStars }, (_, index) => (
                    <StarIcon key={`full-${index}`} />
                ))}
                {halfStar && <StarHalfIcon key="half" />}
                {Array.from({ length: emptyStars }, (_, index) => (
                    <StarBorderIcon key={`empty-${index}`} />
                ))}
            </>
        );
    };

    return (
        <div id="hotelSearchContainer">
            <input id="cityName" type="text" placeholder="Enter city name" />
            <button onClick={handleSearchByInput}>Search Hotels</button>

            <div className="results">
                <h2>Hotel Results:</h2>
                {loading && <p>Loading hotels...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && hotels.length === 0 && <p>No hotels found.</p>}
                <ul>
                    {!loading &&
                        hotels.map((hotel, index) => (
                            <li key={index}>
                                <h3>{hotel.name}</h3>
                                <p>Address: {hotel.address}</p>
                                <p>Phone: {hotel.phone}</p>
                                <p>Rating: {renderStars(hotel.rating)}</p>
                                <p>Reviews: {hotel.reviews}</p>
                                <p>Price Range: ${hotel.price_range_usd.min} - ${hotel.price_range_usd.max}</p>
                                <p>Amenities: {hotel.amenities.join(', ')}</p>
                                <a href={hotel.link} target="_blank" rel="noopener noreferrer">View on TripAdvisor</a>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default HotelSearch;