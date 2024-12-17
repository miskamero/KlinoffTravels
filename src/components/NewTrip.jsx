import { useState, useEffect } from 'react';
// import axios from 'axios';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import WeatherSearch from './WeatherSearch';

const NewTrip = () => {
    const [userId, setUserId] = useState("klinoff");
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [step, setStep] = useState(1);
    const [weather, setWeather] = useState(null);
    let totalDays = 1;
    // step 1: setting up the trip
    // step 2: viewing weather for the trip
    // step 3: searching for flights and selecting a flight
    // step 4: searching for hotels and selecting a hotel
    // step 5: searching for attractions and selecting attraction(s)
    // step 6: viewing the trip itinerary
    // step 7: saving the trip, along with the selected flight, hotel, and attraction(s) with up to 300 characters of notes
    
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
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
            console.log('Origin:', origin);
            console.log('Destination:', destination);
            console.log('Start Date:', startDate);
            console.log('End Date:', endDate);
            totalDays = Math.floor((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
            console.log('Total Days:', totalDays);
            setStep(step + 1);
        }
    }

    console.log('User ID:', userId);
    return (
        <div>
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
                            min={getTodayDate()}
                            value={startDate || getTodayDate()}
                            onChange={(e) => setStartDate(e.target.value)}
                            required /><br/>
                            <label htmlFor="endDate">End Date:</label>
                            <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            min={startDate || getTodayDate()}
                            onChange={(e) => setEndDate(e.target.value)}
                            required /><br/>
                            <button onClick={handleSubmit}>Step 1: Flights</button>
                        </form>
                    ) : step === 2 ? (
                        <>
                            <WeatherSearch destination={destination} setWeather={setWeather} startDate={startDate} endDate={endDate} />
                            <p>Destination: {destination}</p>
                            <p>Start Date: {startDate}</p>
                            <p>End Date: {endDate}</p>
                            <p>Total Days: {totalDays}</p>
                            <button onClick={() => setStep(step - 1)}>Back</button>
                            <button onClick={() => setStep(step + 1)}>Step 2: Hotels</button>
                        </>
                    ) : step === 3 ? (
                        <>
                            <p>Flights</p>
                            <button onClick={() => setStep(step - 1)}>Back</button>
                            <button onClick={() => setStep(step + 1)}>Step 3: Attractions</button>
                        </>
                    ) : step === 4 ? (
                        <>
                            <p>Hotels</p>
                            <button onClick={() => setStep(step - 1)}>Back</button>
                            <button onClick={() => setStep(step + 1)}>Step 4: Itinerary</button>
                        </>
                    ) : step === 5 ? (
                        <>
                            <p>Attractions</p>
                            <button onClick={() => setStep(step - 1)}>Back</button>
                            <button onClick={() => setStep(step + 1)}>Step 5: Save</button>
                        </>
                    ) : step === 6 ? (
                        <>
                            <p>Itinerary</p>
                            <button onClick={() => setStep(step - 1)}>Back</button>
                            <button onClick={() => setStep(step + 1)}>Step 6: Overview</button>
                        </>
                    ) : step === 7 ? (
                        <>
                            <p>Save</p>
                            <button onClick={() => setStep(step - 1)}>Back</button>
                        </>
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