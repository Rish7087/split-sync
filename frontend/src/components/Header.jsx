import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.png";
import './Header.css';
import { useNavigate } from 'react-router-dom'; // Correct hook for navigation in react-router v6

const Header = () => {
    const [user, setUser] = useState(null);
   
    // Retrieve the user from sessionStorage when the component mounts
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Function to refresh the user data after profile update
    const refreshUserData = () => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    };

    return (
        <div className="header">
            <img src={logo} alt="Logo" />
        </div>
    );
};

export default Header;
