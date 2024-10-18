import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import HouseDetails from "./pages/HouseDetails";

function App() {
  const [user, setUser] = useState(() => {
    // Retrieve user from sessionStorage if available
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Fetch logged-in user data if not already available in session storage
    if (!user) {
      axios
        .get("http://localhost:8080/auth/user", { withCredentials: true })
        .then((response) => {
          if (response.data.user) {
            setUser(response.data.user);
            sessionStorage.setItem("user", JSON.stringify(response.data.user)); // Store user in sessionStorage
          }
          setLoading(false);
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            // Handle 401 Unauthorized: User is logged out
            console.error("User is not authenticated. Redirecting to login.");
            sessionStorage.removeItem("user"); // Clear user data from sessionStorage
            setUser(null); // Clear user state
          }
          setAuthError(error.response?.data?.message || "An error occurred");
          setLoading(false);
        });
    } else {
      setLoading(false); // No need to fetch if user is already in sessionStorage
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mainBody">
      <Router>
        <Header user={user} /> {/* Pass user to Header if needed */}
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/home" /> : <LoginPage />}
          />
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Navigate to="/login" />}
          />
          <Route
            path="/home"
            element={user ? <HomePage user={user} /> : <Navigate to="/login" />}
          />
          <Route path="/house/:houseId" element={<HouseDetails />} />
          <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
