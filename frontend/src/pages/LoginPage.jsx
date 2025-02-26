import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
// console.log("All ENV variables:", import.meta.env);
// console.log("Server URL:", import.meta.env.VITE_SERVER_URL);

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = `${SERVER_URL}/auth/google`; // Redirect to backend for Google login
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
  
    axios.get(`${SERVER_URL}/auth/user`, { withCredentials: true, cancelToken: source.token })
      .then((response) => {
        const { user, isNewUser } = response.data;
        if (user) {
          navigate(isNewUser ? '/signup' : '/home');
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) return; // Ignore if request was canceled
        if (error.response?.status === 401) {
          console.log('User not authenticated, showing login page.');
        } else {
          console.error('Error fetching user data:', error);
        }
      });
  
    return () => source.cancel(); // Cleanup on unmount
  }, [navigate]);
  
  return (
    <div
      style={{
        backgroundImage: "url('../assets/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
      }}
    >
      <div>
        <h1>Login to Split Buddies</h1>
        <button
  style={{
    padding: '12px 24px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#0D92F4',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  }}
  onMouseOver={(e) => e.target.style.backgroundColor = '#0078D4'}
  onMouseOut={(e) => e.target.style.backgroundColor = '#0D92F4'}
  onClick={handleGoogleLogin}
>
  Login with Google
</button>

      </div>
    </div>
  );
};

export default LoginPage;
