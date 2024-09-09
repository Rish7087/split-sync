import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/cookieUtils'; // Adjust the import path

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const selectedProfile = localStorage.getItem('selectedProfile');

    fetch(`http://localhost:8080/user/${selectedProfile}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pin }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Login successful') {
          setCookie('currentUser', JSON.stringify(data.user), 7); // Store user data in cookies for 7 days
          navigate('/home');
        } else {
          setError('Invalid PIN');
        }
      })
      .catch(() => setError('Error during login'));
  };

  return (
    <div>
      <h1>Enter your 4-digit PIN</h1>
      <input
        type="password"
        maxLength="4"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      {error && <p>{error}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
