import { Link } from 'react-router-dom';
import '../styles/LandingPage.scss';

const LandingPage = () => {
    return (
        <div className="landingPage">
            <header className="heroSection">
                <h1>Welcome to Klinoff Travels</h1>
                <p>The one-stop solution for planning your  <span id='perfectEffect'>Perfect Trip</span></p>
                <Link to="/signup" className="getStartedButton">Get Started</Link>
            </header>
            <section className="featureSection">
                <div className="feature">
                    <h2>Flight Search</h2>
                    <p>Find the best flights for your trip</p>
                </div>
                <div className="feature">
                    <h2>Hotel Search</h2>
                    <p>Discover the best places to stay</p>
                </div>
                <div className="feature">
                    <h2>Weather Information</h2>
                    <p>Get accurate weather forecasts</p>
                </div>
                <div className="feature">
                    <h2>Local Attractions</h2>
                    <p>Explore popular attractions</p>
                </div>
                <div className="feature">
                    <h2>Itinerary Planner</h2>
                    <p>Plan your trip with ease!</p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;