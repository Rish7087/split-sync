import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PinInput from "react-pin-input";
import Avatar from "@mui/material/Avatar";
import { setCookie } from "../utils/cookieUtils";
import "./LoginPage.css";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const selectedProfileName = localStorage.getItem("selectedProfileName");
    const selectedProfilePic = localStorage.getItem("selectedProfilePic");
    // console.log("profilepic:", selectedProfilePic); // Debugging line
    setUserName(selectedProfileName);
    setProfilePic(selectedProfilePic);
  }, []);

  const handleLogin = () => {
    const selectedProfile = localStorage.getItem("selectedProfile");
    // console.log("selected profile data: ", selectedProfile);
    fetch(`https://split-buddies.onrender.com/user/${selectedProfile}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pin }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Login successful") {
          setCookie("currentUser", JSON.stringify(data.user), 7);
          navigate("/home");
        } else {
          setError("Invalid PIN");
        }
      })
      .catch(() => setError("Error during login"));
  };

  return (
    <div className="main">
      <h1 className="heading">Welcome {userName}!</h1>
      <Avatar
        src={profilePic}
        alt={userName}
        sx={{ width: 180, height: 180, marginBottom: 2 }}
      />
      <h2 className="subheading">Enter your 4-digit PIN</h2>
      <div className="pin">
        <PinInput
          className="pin"
          length={4}
          initialValue=""
          secret
          secretDelay={50}
          onChange={(value) => setPin(value)}
          onComplete={(value) => setPin(value)}
          type="numeric"
          inputStyle={{
            borderColor: "gray",
            borderRadius: "4px",
            width: "3rem",
            height: "3rem",
            color: "white",
          }}
          inputFocusStyle={{ borderColor: "blue" }}
        />
      </div>
      <div className="err">{error && <p>{error}</p>}</div>
      <button className="login" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
