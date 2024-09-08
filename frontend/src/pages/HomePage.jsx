import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedProfile = localStorage.getItem('selectedProfile');
    if (!selectedProfile) {
      navigate('/');
      return;
    }
    // Fetch user data using selectedProfile
    fetch(`/api/user/${selectedProfile}`)
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(err => console.error(err));
  }, [navigate]);

  // if (!userData) return <div>Loading...</div>;

  return (
    <div>
      {/* <h1>Welcome {userData.name}</h1> */}
      <p>Your personalized data goes here.</p>
    </div>
  );
}
