import React from 'react';
import './Card.css';

const Card = ({ name, profilePic, onClick }) => {
  return (
    <div className="panel" onClick={onClick}> {/* Added onClick here */}
      <div className="ring">
        <div className="card">
          <img src={profilePic} alt={name} className="profile-pic" />
        </div>
        <div className="border">
          <p className="title">{name}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
