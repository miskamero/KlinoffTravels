import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PigImage from '../assets/pig.png';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import '../styles/Navbar.scss';

const Navbar = () => {
    let loggedIn = false;
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const [dropDownVisible, setDropDownVisible] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const dropDownRef = useRef();

    const toggleDropDown = () => {
        setDropDownVisible(!dropDownVisible);
    };

    const closeDropdown = () => {
        setDropDownVisible(false);
    };

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
                closeDropdown();
            }
        };
    
        if (dropDownVisible) {
            document.addEventListener("mousedown", checkIfClickedOutside);
        } else {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        }
    
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        };
    }, [dropDownVisible]);

    if (!loading && user) {
        loggedIn = true;
    }

    const search = () => {
        if (searchValue.trim()) {
            navigate(`/flight-search?destination=${searchValue}`);
        } else {
            alert('Please enter a destination');
        }
    };

    const enterCheck = (e) => {
        if (e.key === 'Enter') {
            search();
        }
    }

    const resetSearch = () => {
        setSearchValue('');
        document.querySelector('input').value = '';
    }

    return (
        <div id="navbarContainer">
            <div id="logoContainer" onClick={() => navigate('/')}>
                <img src={PigImage} alt="pig" id="pigImage" />
            </div>
            <div id="searchContainer">
                <div id="searchBarContainer">
                    <Tooltip title="Search">
                        <SearchIcon id="searchIcon" onClick={search}/>
                    </Tooltip>
                    <input type="text" placeholder="Where would you like to go?" onKeyDown={enterCheck} onChange={(e) => setSearchValue(e.target.value)}/>
                    <div id="exploreContainer" className={searchValue ? '' : 'borderExploreContainer'}>
                        {searchValue ? (
                            <CancelIcon id="cancelIcon" onClick={resetSearch}/>
                        ) : (
                            <Tooltip title="Explore">
                                <ExploreIcon id="exploreIcon" onClick={() => navigate(`/search_history`)}/>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>
            <div id="navLinks">
                {loggedIn ? (
                    dropDownVisible ? (
                        <PersonIcon id="personIcon" onClick={toggleDropDown}/>
                    ) : (
                        <Tooltip title="Profile">
                            <PersonIcon id="personIcon" onClick={toggleDropDown}/>
                        </Tooltip>
                    )
                ) : (
                    <Tooltip title="Login">
                        <LoginIcon id="loginIcon" onClick={() => navigate('/login')}/>
                    </Tooltip>
                )}
                <div id="userDropDown" ref={dropDownRef}>
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