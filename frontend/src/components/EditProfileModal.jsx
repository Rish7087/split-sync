// EditProfileModal.jsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Avatar } from "@mui/material";
import axios from "axios";

const EditProfileModal = ({ open, onClose, userId, refreshUserData }) => {
  const [formData, setFormData] = useState({
    name: "",
    profilePic: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (userId) {
      // Fetch current user data when the modal opens
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/user/${userId}/data`);
          setFormData({
            name: response.data.name,
            profilePic: response.data.img || null,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profilePic: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.name);
      if (formData.profilePic) {
        // Include user's name in the filename
        const fileName = `${formData.name}Profile.${formData.profilePic.name.split('.').pop()}`;
        form.append("profilePic", formData.profilePic, fileName);
      }
  
      // Send the updated profile data to the backend
      await axios.put(`http://localhost:8080/user/${userId}/update`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      refreshUserData(); // Refresh the homepage data after saving
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar
            src={preview || formData.profilePic || ""}
            alt="Profile Picture"
            sx={{ width: 100, height: 100, marginBottom: 2 }}
          />
          <Button variant="outlined" component="label">
            Change Profile Picture
            <input type="file" name="profilePic" accept="image/*" hidden onChange={handleInputChange} />
          </Button>
        </div>
        <TextField
          margin="dense"
          name="name"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.name}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
