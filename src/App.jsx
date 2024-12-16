import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth';
import Signup from './components/Signup'
import Login from './components/Login'
import Profile from './components/Profile'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import Footer from './components/Footer'
import UserTrips from './components/UserTrips'
import FlightSearch from './components/FlightSearch'
import HotelSearch from './components/HotelSearch';
import WeatherSearch from './components/WeatherSearch';
import AttractionSearch from './components/AttractionSearch';

import './App.scss'


const App = () => {
  const [userId, setUserId] = useState("klinoff");

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

  console.log('User ID:', userId);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/flight-search" element={<FlightSearch />} />
        <Route path="/hotel-search" element={<HotelSearch />} />
        <Route path="/weather-search" element={<WeatherSearch />} />
        <Route path="/attraction-search" element={<AttractionSearch />} />
        <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="user-trips" element={
            <PrivateRoute>
              {userId ? <UserTrips userId={userId} /> : <p>Loading...</p>}
            </PrivateRoute>
            } />
      </Routes>
      <Footer />
    </>
  )
}

export default App
