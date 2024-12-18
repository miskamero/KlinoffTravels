import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WeatherSearch from './WeatherSearch';
import FlightSearch from './FlightSearch';
import HotelSearch from './HotelSearch';
import AttractionSearch from './AttractionSearch';
import '../styles/NewTripComponents.scss';

const NewTrip = () => {
    const [userId, setUserId] = useState("klinoff");
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    // default state for startDate is tomorrow's date
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        return today.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState('');
    const [step, setStep] = useState(1);
    const [weather, setWeather] = useState(null);
    const [selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);
    const [selectedInboundFlight, setSelectedInboundFlight] = useState(null);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [selectedAttractions, setSelectedAttractions] = useState([]);
    const navigate = useNavigate();
    // let totalDays = 1;
    console.log(weather);

    const getTomorrowDate = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const checkFields = () => {
        if (origin === '' || destination === '' || startDate === '' || endDate === '') {
            return true;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (checkFields()) {
            alert('Please fill in all fields');
            return;
        } else {
            setOrigin(document.getElementById('Origin').value);
            setDestination(document.getElementById('destination').value);
            setStartDate(document.getElementById('startDate').value);
            setEndDate(document.getElementById('endDate').value);
            // totalDays = Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
            setStep(step + 1);
        }
    }

    const handleSelectOutboundFlight = (flight) => {
        setSelectedOutboundFlight(flight);
        setStep(step + 1);
    }

    const handleSelectInboundFlight = (flight) => {
        setSelectedInboundFlight(flight);
        setStep(step + 1);
    }

    const handleSelectHotel = (hotel) => {
        setSelectedHotel(hotel);
        setStep(step + 1);
    }

    const handleSelectAttraction = (attractions) => {
        setSelectedAttractions(attractions);
    }

    const handleReset = () => {
        setOrigin('');
        setDestination('');
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate('');
        setSelectedOutboundFlight(null);
        setSelectedInboundFlight(null);
        setSelectedHotel(null);
        setSelectedAttractions([]);
        setStep(1);
    }

    const handleTripSave = async () => {
        const tripDetails = {
            user_id: userId,
            trip_name: `${origin} to ${destination}`,
            departure_city: origin,
            arrival_city: destination,
            departure_date: startDate,
            return_date: endDate,
            details: JSON.stringify({
                outbound_flight: selectedOutboundFlight,
                inbound_flight: selectedInboundFlight,
                hotel: selectedHotel,
                attractions: selectedAttractions
            })
        };

        try {
            const response = await axios.post('http://127.0.0.1:5001/api/trips', tripDetails);
            if (response.status === 201) {
                alert('Trip saved successfully!');
                handleReset();
                navigate('/user-trips');
            }
        } catch (error) {
            alert(`Error saving trip: ${error.message}`);
        }
    }

    return (
        <div id="newTripContainer">
            {userId !== "klinoff" ? (
                <>
                    <h1>New Trip</h1>
                    <p>Step {step}</p>
                    {step === 1 ? (
                        <form>
                            <label htmlFor="Origin">Origin City:</label>
                            <input
                                type="text"
                                id="Origin"
                                name="Origin"
                                onChange={(e) => setOrigin(e.target.value)}
                                required /><br/>
                            <label htmlFor="destination">Destination City:</label>
                            <input
                                type="text"
                                id="destination"
                                name="destination"
                                onChange={(e) => setDestination(e.target.value)}
                                required /><br/>
                            <label htmlFor="startDate">Start Date:</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                min={getTomorrowDate()}
                                value={startDate || getTomorrowDate()}
                                onChange={(e) => setStartDate(e.target.value)}
                                required /><br/>
                            <label htmlFor="endDate">End Date:</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                min={startDate || getTomorrowDate()}
                                onChange={(e) => setEndDate(e.target.value)}
                                required /><br/>
                            <button onClick={handleSubmit}>Next</button>
                        </form>
                    ) : step === 2 ? (
                        <div className="trip-section">
                            <WeatherSearch destination={destination} setWeather={setWeather} startDate={startDate} endDate={endDate} />
                            <p>Destination: {destination}</p>
                            <p>Start Date: {startDate}</p>
                            <p>End Date: {endDate}</p>
                            <button onClick={() => setStep(step - 1)}>Back</button>
                            <button onClick={() => setStep(step + 1)}>Step 3: Outbound Flight</button>
                        </div>
                    ) : step === 3 ? (
                        <div className="trip-section">
                            <FlightSearch departureDate={startDate} departureCity={origin} arrivalCity={destination} onSelectFlight={handleSelectOutboundFlight} isOutbound={true} />
                            <button onClick={() => setStep(step - 1)}>Back</button>
                        </div>
                    ) : step === 4 ? (
                        <div className="trip-section">
                            <FlightSearch departureDate={endDate} departureCity={destination} arrivalCity={origin} onSelectFlight={handleSelectInboundFlight} isOutbound={false} />
                            <button onClick={() => setStep(step - 1)}>Back</button>
                            <button onClick={() => setStep(step + 1)}>Step 5: Hotels</button>
                        </div>
                    ) : step === 5 ? (
                        <div className="trip-section">
                            <HotelSearch arrivalCity={destination} onSelectHotel={handleSelectHotel} />
                            <button onClick={() => setStep(step - 1)}>Back</button>
                            <button onClick={() => setStep(step + 1)}>Step 6: Attractions</button>
                        </div>
                    ) : step === 6 ? (
                        <div className="trip-section">
                            <AttractionSearch arrivalCity={destination} onSelectAttraction={handleSelectAttraction} />
                            <button onClick={() => setStep(step - 1)}>Back</button>
                            <button onClick={() => setStep(step + 1)}>Step 7: Overview</button>
                        </div>
                    ) : step === 7 ? (
                        <div className="trip-section">
                            <h2>Trip Overview</h2>
                            <p><strong>Origin:</strong> {origin}</p>
                            <p><strong>Destination:</strong> {destination}</p>
                            <p><strong>Start Date:</strong> {startDate}</p>
                            <p><strong>End Date:</strong> {endDate}</p>
                            <p><strong>Outbound Flight:</strong> {selectedOutboundFlight ? `${selectedOutboundFlight.legs[0].segments[0].flightNumber} - ${selectedOutboundFlight.legs[0].carriers.marketing[0].name} - ${selectedOutboundFlight.price.formatted}` : 'None selected'}</p>
                            <p><strong>Inbound Flight:</strong> {selectedInboundFlight ? `${selectedInboundFlight.legs[0].segments[0].flightNumber} - ${selectedInboundFlight.legs[0].carriers.marketing[0].name} - ${selectedInboundFlight.price.formatted}` : 'None selected'}</p>
                            <p><strong>Hotel:</strong> {selectedHotel ? selectedHotel.name : 'None selected'}</p>
                            <p><strong>Attractions:</strong></p>
                            <ul>
                                {selectedAttractions.map((attraction, index) => (
                                    <li key={index}>{attraction.properties.name_international?.en || attraction.properties.name}</li>
                                ))}
                            </ul>
                            <button onClick={handleReset}>Reset</button>
                            <button onClick={handleTripSave}>Save</button>
                            <button onClick={() => setStep(step - 1)}>Back</button>
                        </div>
                    ) : (
                        <p>Step {step}</p>
                    )}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default NewTrip;