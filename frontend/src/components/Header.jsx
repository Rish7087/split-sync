import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is imported here for logout
import logo from "../assets/logo.png";
import './Header.css';
import { useNavigate } from 'react-router-dom'; // Correct hook for navigation in react-router v6

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // useNavigate hook for navigation

    // Retrieve the user from sessionStorage when the component mounts
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // console.error("User not found in session storage");
        }
    }, []);

    const handleLogout = () => {
        axios
            .get("http://localhost:8080/auth/logout", { withCredentials: true })
            .then(() => {
                sessionStorage.removeItem("user"); // Clear user data from sessionStorage
                setUser(null); // Clear user data in state
                navigate("/login"); // Redirect to login
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    };

    return (
        <div className="header">
            <img src={logo} alt="Logo" />
            {user && (
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            )}
        </div>
    );
};

export default Header;
