import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/auth/google'; // Redirect to backend for Google login
  };

  useEffect(() => {
    // Check if user is already logged in
    axios
      .get('http://localhost:8080/auth/user', { withCredentials: true })
      .then((response) => {
        const { user, isNewUser } = response.data;
        if (user) {
          if (isNewUser) {
            navigate('/signup');  // Redirect to signup page if the user is new
          } else {
            navigate('/home');  // Redirect to home page if the user is existing
          }
        }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          console.log("User not authenticated, showing login page.");
        } else {
          console.error("Error fetching user data:", error);
        }
      });
  }, [navigate]);

  return (
    <div>
      <h1>Login to Split Buddies</h1>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default LoginPage;
