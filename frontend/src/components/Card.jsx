import React from 'react';
import './Card.css';

const Card = ({ destination, profilePic }) => {
  return (
    <div className="panel">
      <div className="ring">
        <div className="card">
          <img src={profilePic} alt={destination} className="profile-pic" />
        </div>
        <div className="border">
          <p className="title">{destination}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
