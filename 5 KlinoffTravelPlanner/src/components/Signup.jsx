import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('User signed up successfully');
        } catch (error) {
                alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <h2>Signup</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Signup</button>
        </form>
    );
}

export default Signup;