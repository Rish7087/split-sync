import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './LandingPage.css';
import user1Img from '../assets/image1.png';
import user2Img from '../assets/image2.png';
import user3Img from '../assets/image3.png';
import user4Img from '../assets/image4.png';
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
      })
      .catch((error) => console.error('Error fetching profiles:', error));
  }, []);

  const handleProfileSelect = (id) => {
    localStorage.setItem('selectedProfile', id);
    navigate('/login');
  };

  return (
    <div>
      <h1 className="heading">Select Your Profile</h1>
      <div className="card-cont">
        <CardContainer profiles={profiles} onProfileSelect={handleProfileSelect} />
      </div>
    </div>
  );
}
