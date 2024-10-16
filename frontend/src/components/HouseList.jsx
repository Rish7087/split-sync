import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation

const HouseList = ({ userId }) => {
  const [houses, setHouses] = useState([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/${userId}/houses`);
        setHouses(response.data.houses);
      } catch (error) {
        console.error('Error fetching houses:', error);
      }
    };

    fetchHouses();
  }, [userId]);

  const handleCreateHouse = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/houses`, { userId });
      const newHouse = response.data.house;
      setHouses([...houses, newHouse]); // Add the new house to the list
    } catch (error) {
      console.error('Error creating house:', error);
    }
  };

  const navigateToHouseDetails = (houseId) => {
    navigate(`/house/${houseId}`); // Navigate to the house details page
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5">Your Houses</Typography>
      <Button variant="contained" onClick={handleCreateHouse} style={{ marginTop: '10px' }}>
        Create New House
      </Button>
      <Grid container spacing={2} style={{ marginTop: '10px' }}>
        {houses.length > 0 ? (
          houses.map((house) => (
            <Grid item xs={12} sm={6} md={4} key={house._id}>
              <Paper elevation={2} style={{ padding: '10px' }}>
                <Typography variant="h6">{house.name}</Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigateToHouseDetails(house._id)} // Navigate to house details
                  style={{ marginTop: '10px' }}
                >
                  View Details
                </Button>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography style={{ marginTop: '20px' }}>
            No houses found. Please create one!
          </Typography>
        )}
      </Grid>
    </Paper>
  );
};

export default HouseList;
