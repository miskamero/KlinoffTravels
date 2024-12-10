import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

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
        <div>
            {user ? (
                <div>
                    <h2>Welcome {user.email}</h2>
                    <button onClick={handleSignOut}>Sign out</button>
                </div>
            ) : (
                <h2>User not logged in</h2>
            )}
        </div>
    );
}

export default Profile;