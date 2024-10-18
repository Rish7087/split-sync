import React, { useState } from 'react';
import { Autocomplete, TextField, Button } from '@mui/material';
import axios from 'axios';

const AddHouseMembers = ({ houseId, onMemberAdded }) => {
  const [inputValue, setInputValue] = useState('');
  const [users, setUsers] = useState([]); // Store fetched users

  // Function to fetch users based on input
  const fetchUsers = async (event) => {
    const query = event.target.value;
    setInputValue(query);

    if (query) {
      try {
        const response = await axios.get(`http://localhost:8080/user/all`);
        setUsers(response.data); // Update users with response data
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    } else {
      setUsers([]); // Reset users if input is empty
    }
  };

  // Function to add a member to the house
  const addMember = async (email) => {
    try {
      await axios.post(`http://localhost:8080/house/${houseId}/add`, { email });
      onMemberAdded(); // Call the function to update house members
      console.log('Member added:', email);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  return (
    <div>
      <Autocomplete
        options={users}
        getOptionLabel={(option) => option.email || ''} // Ensure this returns a valid string
        onInputChange={fetchUsers}
        renderInput={(params) => (
          <TextField {...params} label="Search Users" variant="outlined" />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option._id}>
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
