import React, { useEffect, useState } from "react";
import HouseList from "../components/HouseList";
import { Paper } from "@mui/material";
import ButtonMenu from "../components/ButtonMenu";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
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
      <Paper 
        elevation={6} 
        style={{
          padding: "20px",
          background: "rgba(255, 255, 255, 0.1)",  // Semi-transparent
          backdropFilter: "blur(10px)", // Blur effect
          borderRadius: "12px", // Rounded corners
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Soft shadow
          color: "white",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: "white", }}>
          <h2 style={{ margin: 0 , color: 'rgba(255, 255, 255, 0.97)'}}>{userData.name}</h2>
          <ButtonMenu />
        </div>
        
        <HouseList userId={userData._id} serverUrl={SERVER_URL} />
      </Paper>
    </div>
  );
};

export default HomePage;
