import React from 'react';
import Card from './Card';
import './Card.css';

const CardContainer = ({ profiles, onProfileSelect }) => {
  return (
    <div className="container">
      {profiles.map((profile) => (
        <div key={profile._id} onClick={() => onProfileSelect(profile._id, profile.name)}>
          <Card 
            name={profile.name} 
            profilePic={profile.profilePic}
          />
        </div>
      ))}
    </div>
  );
};

export default CardContainer;
