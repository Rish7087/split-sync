import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PinInput from "react-pin-input";
import { setCookie } from "../utils/cookieUtils"; // Adjust the import path
import "./LoginPage.css";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const selectedProfileName = localStorage.getItem("selectedProfileName");
    setUserName(selectedProfileName);
  }, []);

  const handleLogin = () => {
    const selectedProfile = localStorage.getItem("selectedProfile");

    fetch(`http://localhost:8080/user/${selectedProfile}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pin }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Login successful") {
          setCookie("currentUser", JSON.stringify(data.user), 7); // Store user data in cookies for 7 days
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
      <h2 className="subheading">Enter your 4-digit PIN</h2>
    <div className="pin">

    <PinInput
        className="pin"
        length={4}
        initialValue=""
        secret
        secretDelay={50} // Delay to show the typed digit before masking it
        onChange={(value) => setPin(value)}
        onComplete={(value) => setPin(value)}
        type="numeric"
        inputStyle={{
          borderColor: "gray",
          borderRadius: "4px",
          width: "3rem",
          height: "3rem",
          color: "white"
          
        }}
        inputFocusStyle={{ borderColor: "blue" }}
      />
    </div>
      
        <div className="err">
        {error && <p>{error}</p>}
        </div>
      
      <button className="login" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
