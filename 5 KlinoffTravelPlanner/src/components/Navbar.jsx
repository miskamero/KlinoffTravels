import { useState } from 'react';
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
    const [dropDownVisible, setDropDownVisible] = useState(false);

    const toggleDropDown = () => {
        setDropDownVisible(!dropDownVisible);
    };

    if (!loading && user) {
        loggedIn = true;
    }

    return (
        <div id="navbarContainer">
            <div id="logoContainer">
                <img src={PigImage} alt="pig" id="pigImage" />
            </div>
            <div id="searchContainer">
                <Tooltip title="Search">
                    <SearchIcon id="searchIcon"/>
                </Tooltip>
                <input type="text" placeholder="Where do you want to go?"/>
            </div>
            <div id="navLinks">
                {dropDownVisible ? (
                    <PersonIcon id="personIcon" onClick={toggleDropDown}/>
                ) : (
                    <Tooltip title="Profile">
                        <PersonIcon id="personIcon" onClick={toggleDropDown}/>
                    </Tooltip>
                )}
                <div id="userDropDown">
                    <div id="dropDownContainer" className={dropDownVisible ? 'show' : ''}>
                        {loggedIn ? (
                            <>
                                <p>Hello, {user.displayName}</p>
                                <Link to="/profile">Profile</Link>
                                <button onClick={() => auth.signOut()}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/signup">Signup</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Navbar;