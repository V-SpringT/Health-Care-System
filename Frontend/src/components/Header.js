import React from 'react';
import './styles/Header.css';
import profilePic from './Assets/profile.jpg';


const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <h1>HealthCare System</h1>
                <div className="header-right">
                    <div className="search-container" style={{marginRight: "10px"}}>
                        <span>Jack</span>
                    </div>
                    <div className="profile-pic">
                        <img src={profilePic} alt="Profile" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
