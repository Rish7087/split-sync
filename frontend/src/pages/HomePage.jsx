import React, { useEffect } from "react";
import { Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HouseList from "../components/HouseList";
import ButtonMenu from "../components/ButtonMenu";
import { useUser } from "../../context/UserContext";

const HomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        console.log("No user found, redirecting to /login");
        navigate("/login");
      } else {
        console.log("User retrieved from localStorage:", JSON.parse(storedUser));
      }
    } else {
      console.log("User data available in context:", user);
    }
  }, [user, navigate]);
  
  if (!user) return null; // Render nothing while user is null

  return (
    <div className="homepage">
      <Paper elevation={6} style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ margin: 0 }}>{user.name}</h2>
          <ButtonMenu />
        </div>
        <HouseList userId={user.userId} />
      </Paper>
    </div>
  );
};

export default HomePage;
