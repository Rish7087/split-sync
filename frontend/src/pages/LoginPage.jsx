import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import apiClient from "../components/apiClient";

const LoginPage = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const name = urlParams.get("name");
    const email = urlParams.get("email");
    const profilePic = urlParams.get("profilePic");

    if (userId && name && email && profilePic) {
      const user = { userId, name, email, profilePic };
      login(user); // Store user data
      console.log("User data stored in context and localStorage:", user);
    
      setTimeout(() => {
        navigate("/home"); // Redirect after confirming storage
      }, 50);
    }
    
  }, [login, navigate]);

  const handleGoogleLogin = () => {
    const googleLoginUrl = `${apiClient.defaults.baseURL}/auth/google`;
    window.location.href = googleLoginUrl;
  };

  return (
    <div>
      <h1>Login to Split Buddies</h1>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#0D92F4",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handleGoogleLogin}
      >
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;
