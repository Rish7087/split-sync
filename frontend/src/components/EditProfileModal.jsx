import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Avatar } from "@mui/material";
import PinInput from "react-pin-input"; // Import PinInput for 4-digit PIN entry
import axios from "axios";

const EditProfileModal = ({ open, onClose, userId, refreshUserData }) => {
  const [formData, setFormData] = useState({
    name: "",
    profilePic: null,
    pin: "", // New state for PIN
  });

  const [preview, setPreview] = useState(null);
  const [pinError, setPinError] = useState(""); // State for PIN error handling

  useEffect(() => {
    if (userId) {
      // Fetch current user data when the modal opens
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`https://split-buddies.onrender.com/user/${userId}/data`);
          setFormData({
            name: response.data.name,
            profilePic: response.data.img || null,
            pin: "", // Reset PIN field when fetching user data
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
    // Validate PIN length before saving
    if (formData.pin.length !== 4 || isNaN(formData.pin)) {
      setPinError("Please enter a valid 4-digit PIN.");
      return;
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("pin", formData.pin); // Add PIN to form data
      if (formData.profilePic) {
        // Include user's name in the filename
        const fileName = `${formData.name}Profile.${formData.profilePic.name.split('.').pop()}`;
        form.append("profilePic", formData.profilePic, fileName);
      }

      // Send the updated profile data to the backend
      await axios.put(`https://split-buddies.onrender.com/user/${userId}/update`, form, {
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

        <h3>Change 4-digit PIN</h3>
        <PinInput
          length={4}
          initialValue=""
          secret
          secretDelay={100}
          onChange={(value) => setFormData((prev) => ({ ...prev, pin: value }))}
          onComplete={(value) => setFormData((prev) => ({ ...prev, pin: value }))}
          type="numeric"
          inputStyle={{
            borderColor: "gray",
            borderRadius: "4px",
            width: "3rem",
            height: "3rem",
            color: "black",
          }}
          inputFocusStyle={{ borderColor: "blue" }}
        />
        {pinError && <p style={{ color: "red" }}>{pinError}</p>} {/* Display PIN error */}
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
