import { Link } from "react-router-dom";
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PigImage from '../assets/pig.png';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';
import '../styles/Navbar.scss';

const Navbar = () => {
    // check if user is logged in
    let loggedIn = false;
    const [user, loading] = useAuthState(auth);

    if (!loading && user) {
        loggedIn = true;
    }

    return (
        <div id="navbarContainer">
            {/* <h1 id="header">Klinoff Travels</h1>
            <div id="linksContainer">
                <Link to="/signup">Signup</Link>
                <Link to="/login">Login</Link>
                <Link to="/profile">Profile</Link>
            </div> */}
            <img src={PigImage} alt="pig" id="pigImage" />
            <Tooltip title="Search">
                <SearchIcon id="searchIcon"/>
            </Tooltip>
            <input type="text" placeholder="Where do you want to go?"/>
            <Tooltip title="Profile">
                <PersonIcon id="personIcon"/>
            </Tooltip>
            <div id="userDropDown">
                {/* if user is logged in, show profile and logout, else show login and signup */}
                {loggedIn ? (
                    <>
                        <Link to="/profile">Profile</Link>
                        <button onClick={() => auth.signOut()}>Logout</button>
                    </>
                ) : (
                    <>
                        {/* <a href='/login'>Login</a>
                        <a href='/signup'>Signup</a> */}
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </div>
        </div>
    )
};

export default Navbar;