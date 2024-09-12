import React from 'react';
import Card from './Card';
import { Grid } from '@mui/material';
import './Card.css';

const CardContainer = ({ profiles, onProfileSelect }) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {profiles.map((profile) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={profile._id}>
          <Card 
            name={profile.name} 
            profilePic={profile.profilePic}
            onClick={() => onProfileSelect(profile._id, profile.name, profile.profilePic)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default CardContainer;
