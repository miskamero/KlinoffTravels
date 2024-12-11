import { useState } from 'react';
import { Link } from "react-router-dom";
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PigImage from '../assets/pig.png';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import '../styles/Navbar.scss';

const Navbar = () => {
    let loggedIn = false;
    const [user, loading] = useAuthState(auth);
    const [dropDownVisible, setDropDownVisible] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const toggleDropDown = () => {
        setDropDownVisible(!dropDownVisible);
    };

    const closeDropdown = () => {
        setDropDownVisible(false);
    };

    if (!loading && user) {
        loggedIn = true;
    }

    const search = () => {
        const searchValue = document.querySelector('input').value;
        alert(`Searching for ${searchValue}`);
    };

    const enterCheck = (e) => {
        if (e.key === 'Enter') {
            search();
        }
    }

    return (
        <div id="navbarContainer">
            <div id="logoContainer">
                <img src={PigImage} alt="pig" id="pigImage" />
            </div>
            <div id="searchContainer">
                <div id="searchBarContainer">
                    <Tooltip title="Search">
                        <SearchIcon id="searchIcon" onClick={search}/>
                    </Tooltip>
                    <input type="text" placeholder="Where do you want to go?" onKeyDown={enterCheck} onChange={(e) => setSearchValue(e.target.value)}/>
                </div>
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
                                <Link to="/profile" onClick={closeDropdown}>Profile</Link>
                                <div id='logoutButton' onClick={() => { auth.signOut(); closeDropdown()}}>
                                    <p>Logout</p>
                                    <LogoutIcon />
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeDropdown}>Login</Link>
                                <Link to="/signup" onClick={closeDropdown}>Signup</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Navbar;