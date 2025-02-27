import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL; // Use environment variable

const AddHouseMembers = ({ houseId, onMemberAdded }) => {
  const [inputValue, setInputValue] = useState('');
  const [users, setUsers] = useState([]); // Store fetched users
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      console.error("User not found in local storage");
    }
  }, []);

  const fetchUsers = async (event) => {
    const query = event.target.value;
    setInputValue(query);

    if (query) {
      try {
        // Optionally, you could pass query as a parameter if your API supports it
        const response = await axios.get(`${SERVER_URL}/user/all`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    } else {
      setUsers([]);
    }
  };

  const addMember = async (username) => {
    if (!userData || !userData._id) {
      console.error("User data is not available yet");
      return;
    }

    try {
      // Send the username (not email) to the backend
      await axios.post(`${SERVER_URL}/house/add-member`, { name: username, houseId, userId: userData._id });
      onMemberAdded();
      console.log('Member added:', username);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <Autocomplete
        options={users}
        getOptionLabel={(option) => option.username || ''}
        onInputChange={fetchUsers}
        renderInput={(params) => (
          <TextField {...params} label="Search Users" variant="outlined" />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option._id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {option.username}
            <Button onClick={() => addMember(option.username)} variant="contained" color="primary">
              Add
            </Button>
          </li>
        )}
      />
    </div>
  );
};

export default AddHouseMembers;