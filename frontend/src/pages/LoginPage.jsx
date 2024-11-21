import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  // const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = 'https://split-buddies.onrender.com/auth/google'; // Redirect to backend for Google login
  };

  // useEffect(() => {
  //   // Check if user is already logged in
  //   axios
  //     .get('https://split-buddies.onrender.com/auth/user', { withCredentials: true })
  //     .then((response) => {
  //       const { user, isNewUser } = response.data;
  //       if (user) {
  //         if (isNewUser) {
  //           navigate('/signup'); // Redirect to signup page if the user is new
  //         } else {
  //           navigate('/home'); // Redirect to home page if the user is existing
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       if (error.response?.status === 401) {
  //         console.log('User not authenticated, showing login page.');
  //       } else {
  //         console.error('Error fetching user data:', error);
  //       }
  //     });
  // }, [navigate]);

  return (
    <div
      style={{
        backgroundImage: "url('../assets/background.png')", // Replace with the actual path to your image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white', // Optional: to contrast text with the background
      }}
    >
      <div>
        <h1>Login to Split Buddies</h1>
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#0D92F4', // Button color
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
