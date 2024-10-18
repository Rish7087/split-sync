import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Paper, Grid } from '@mui/material';

const HouseDetails = () => {
  const { houseId } = useParams(); // Get houseId from URL
  const [house, setHouse] = useState(null); // State for house details
  const [loading, setLoading] = useState(true); // To show loading state if necessary
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/house/${houseId}`);
        setHouse(response.data); // Set house data in state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching house details:', error);
      }
    };

    fetchHouseDetails();
  }, [houseId]);

  const handleCreateExpenseList = () => {
    // Logic to navigate to the create expense list page (you will build this page separately)
    navigate(`/house/${houseId}/create-expense-list`);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5">House Details: {house.name}</Typography>
      <Typography variant="body1" style={{ marginTop: '10px' }}>
        Number of Members: {house.members.length}
      </Typography>
      {/* Add more house details as needed */}
      <Grid container spacing={2} style={{ marginTop: '10px' }}>
        {house.rooms.map((room, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={2} style={{ padding: '10px' }}>
              <Typography variant="h6">Room: {room.name}</Typography>
              {/* Add room details here */}
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateExpenseList}
        style={{ marginTop: '20px' }}
      >
        Create New Expense List
      </Button>
    </Paper>
  );
};

export default HouseDetails;
