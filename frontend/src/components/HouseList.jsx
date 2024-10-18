import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Paper, Grid, Modal, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HouseList = ({ userId }) => {
  const [houses, setHouses] = useState([]);
  const [open, setOpen] = useState(false);
  const [houseName, setHouseName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/house/all/${userId}`);
        setHouses(response.data || []); // Ensure it's an empty array if undefined
        // console.log(response.data);
      } catch (error) {
        console.error('Error fetching houses:', error);
      }
    };

    fetchHouses();
  }, [userId]);

  const handleCreateHouse = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/house/create`, {
        name: houseName,
        members: [userId], // Add current user as a member
      });
      const newHouse = response.data.house;
      setHouses((prevHouses) => [...prevHouses, newHouse]);
      handleClose(); // Close modal after creating the house
    } catch (error) {
      console.error('Error creating house:', error);
    }
  };

  const navigateToHouseDetails = (houseId) => {
    navigate(`/house/${houseId}`);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setHouseName(''); // Reset house name on modal close
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5">Your Houses</Typography>
      <Button variant="contained" onClick={handleOpen} style={{ marginTop: '10px' }}>
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
                  onClick={() => navigateToHouseDetails(house._id)}
                  style={{ marginTop: '10px' }}
                >
                  Enter House
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

      {/* Modal for creating a new house */}
      <Modal open={open} onClose={handleClose}>
        <Paper style={{ padding: '20px', margin: 'auto', maxWidth: '400px', marginTop: '20%' }}>
          <Typography variant="h6">Create New House</Typography>
          <TextField
            label="House Name"
            value={houseName}
            onChange={(e) => setHouseName(e.target.value)}
            fullWidth
            style={{ marginTop: '20px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateHouse}
            style={{ marginTop: '20px' }}
            disabled={!houseName} // Disable if house name is empty
          >
            Create
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

export default HouseList;
