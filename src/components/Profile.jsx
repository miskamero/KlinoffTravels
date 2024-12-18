import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import '../styles/Profile.scss';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            alert('User signed out successfully');
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="profilePage">
            {user ? (
                <div className="profileContainer">
                    <h2>Welcome, {user.email}</h2>
                    <button onClick={handleSignOut} className="signOutButton">Sign out</button>
                    <Link to="/flight-search" className="profileButton">Flight Search</Link>
                    <Link to="/new-trip" className="profileButton">New Trip</Link>
                </div>
            ) : (
                <h2>User not logged in</h2>
            )}
        </div>
    );
}

export default Profile;