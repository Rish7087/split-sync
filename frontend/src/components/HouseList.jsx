import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, Paper, Grid, Modal, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HouseList = ({ userId }) => {
  const [houses, setHouses] = useState([]);
  const [open, setOpen] = useState(false);
  const [houseName, setHouseName] = useState('');
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/house/all/${userId}`);
        setHouses(response.data || []);
      } catch (error) {
        console.error('Error fetching houses:', error);
      }
    };

    fetchHouses();
  }, [userId, SERVER_URL]);

  const handleCreateHouse = async () => {
    try {
      const response = await axios.post(`${SERVER_URL}/house/create`, {
        name: houseName,
        userId: userId
      });
      const newHouse = response.data.house;
      setHouses((prevHouses) => [...prevHouses, newHouse]);
      handleClose(); 
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error('Error creating house:', error);
      }
    }
  };

  const navigateToHouseDetails = (houseId) => {
    navigate(`/house/${houseId}`);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setHouseName('');
  };

  return (
    <Paper
      elevation={6}
      style={{
        padding: '20px',
        marginTop: '20px',
        background: 'rgba(255, 255, 255, 0.1)',  // Semi-transparent
        backdropFilter: 'blur(10px)', // Blur effect
        borderRadius: '12px', // Rounded corners
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Soft shadow
      }}
    >
      <Typography variant="h5" style={{ fontWeight: 'bold' , color: "white"}}>Your Houses</Typography>
      <Button
        variant="contained"
        onClick={handleOpen}
        style={{
          marginTop: '10px',
          backgroundColor: 'rgba(42, 178, 227, 0.81)',
          color: '#fff',
          backdropFilter: 'blur(5px)',
        }}
      >
        Create New House
      </Button>
      <Grid container spacing={2} style={{ marginTop: '10px', }}>
        {houses.length > 0 ? (
          houses.map((house) => (
            <Grid item xs={12} sm={6} md={4} key={house._id}>
              <Paper
                elevation={2}
                style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.1)', // Glassmorphic card
                  backdropFilter: 'blur(10px)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography variant="h6" style={{ fontWeight: 'bold', color: "white" }}>{house.name}</Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigateToHouseDetails(house._id)}
                  style={{ marginTop: '10px', color: '#fff',backgroundColor: 'rgba(227, 162, 42, 0.81)',}}
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
        <Paper
          style={{
            padding: '20px',
            margin: 'auto',
            maxWidth: '400px',
            marginTop: '20%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px)',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Typography variant="h6" style={{ fontWeight: 'bold', color: 'white'}}>Create New House</Typography>
          <TextField
            label="House Name"
            value={houseName}
            onChange={(e) => setHouseName(e.target.value)}
            fullWidth
            style={{ marginTop: '20px' , color: "white"}}
            InputProps={{
              style: {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateHouse}
            style={{
              marginTop: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              color: '#fff',
              backdropFilter: 'blur(5px)',
            }}
            disabled={!houseName}
          >
            Create
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

export default HouseList;
