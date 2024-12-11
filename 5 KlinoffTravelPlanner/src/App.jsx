import { Route, Routes } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import Profile from './components/Profile'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import Footer from './components/Footer'
import './App.scss'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
      </Routes>
      <Footer />
    </>
  )
}

export default App
