import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // alert('User logged in successfully');
            navigate('/profile');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div id="formContainer">
            <form id='userForm' onSubmit={handleLogin}>
                <h2>Login</h2>
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
                <button type="submit">Login</button>
                <p>
                    Don&apos;t have an account? <Link to="/signup">Signup</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;