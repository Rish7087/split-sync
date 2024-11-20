import React, { useEffect, useState } from "react";
import axios from "axios";
import HouseList from "../components/HouseList"; // Import the new component
import { Paper } from "@mui/material";
import ButtonMenu from "../components/ButtonMenu";

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      console.error("User not found in session storage");
    }
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="homepage">
      <Paper elevation={6} style={{ padding: '20px' }}>
        {/* Flexbox container for username and ButtonMenu */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>{userData.name}</h2>
          <ButtonMenu />
        </div>
        
        <HouseList userId={userData._id} /> {/* Include the House List */}
      </Paper>
    </div>
  );
  
};

export default HomePage;
