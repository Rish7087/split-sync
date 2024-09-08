import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Call your API to validate the PIN here
    if (pin === '1234') {  // Replace with actual validation logic
      navigate('/home');
    } else {
      alert('Invalid PIN');
    }
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
