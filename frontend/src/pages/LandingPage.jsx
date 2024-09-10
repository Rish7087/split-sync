import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './LandingPage.css';
import user1Img from '../assets/user1.jpeg';
import user2Img from '../assets/user2.jpeg';
import user3Img from '../assets/user3.jpeg';
import user4Img from '../assets/user4.jpeg';
import CardContainer from '../components/CardContainer';

export default function LandingPage() {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/user/all')
      .then((res) => res.json())
      .then((data) => {
        const images = [user1Img, user2Img, user3Img, user4Img];
        const fixedProfiles = data.map((profile, index) => ({
          ...profile,
          profilePic: images[index] || '/default-image.png',
        }));
        setProfiles(fixedProfiles);
        console.log(fixedProfiles);
      })
      .catch((error) => console.error('Error fetching profiles:', error));
  }, []);

  const handleProfileSelect = (id, name) => {
    localStorage.setItem('selectedProfile', id);
    localStorage.setItem('selectedProfileName', name);
    navigate('/login');
  };

  return (
    <div>
      <h1 className="heading">Who's this?</h1>
      <div className="card-cont">
        <CardContainer 
          profiles={profiles} 
          onProfileSelect={(id, name) => handleProfileSelect(id, name)} 
        />
      </div>
    </div>
  );
}
