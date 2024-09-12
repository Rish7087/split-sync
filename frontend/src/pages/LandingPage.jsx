import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardContainer from "../components/CardContainer";
import './LandingPage.css';
export default function LandingPage() {
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/user/all')
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data);
        // console.log(data);
      })
      .catch((error) => console.error('Error fetching profiles:', error));
  }, []);

  const handleProfileSelect = (id, name, profilePic) => {
    localStorage.setItem('selectedProfile', id);
    localStorage.setItem('selectedProfileName', name);
    localStorage.setItem('selectedProfilePic', profilePic);
    navigate('/login');
  };

  return (
    <div>
      <h1 className="heading">Who's this?</h1>
      <div className="card-cont">
        <CardContainer 
          profiles={profiles} 
          onProfileSelect={handleProfileSelect} 
        />
      </div>
    </div>
  );
}
