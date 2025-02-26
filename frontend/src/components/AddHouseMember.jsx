import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL; // Use environment variable

const AddHouseMembers = ({ houseId, onMemberAdded }) => {
  const [inputValue, setInputValue] = useState('');
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      console.error("User not found in session storage");
    }
  }, []);

  const fetchUsers = async (event) => {
    const query = event.target.value;
    setInputValue(query);

    if (query) {
      try {
        const response = await axios.get(`${SERVER_URL}/user/all`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    } else {
      setUsers([]);
    }
  };

  const addMember = async (email) => {
    if (!userData || !userData._id) {
      console.error("User data is not available yet");
      return;
    }

    try {
      await axios.post(`${SERVER_URL}/house/add-member`, { email, houseId, userId: userData._id });
      onMemberAdded();
      console.log('Member added:', email);
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
        getOptionLabel={(option) => option.email || ''}
        onInputChange={fetchUsers}
        renderInput={(params) => (
          <TextField {...params} label="Search Users" variant="outlined" />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option._id} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            {option.email}
            <Button onClick={() => addMember(option.email)} variant="contained" color="primary">
              Add
            </Button>
          </li>
        )}
      />
    </div>
  );
};

export default AddHouseMembers;