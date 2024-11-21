import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import HouseDetails from "./pages/HouseDetails";
import { useUser } from "../context/UserContext";
import "./App.css";

function App() {
  const { user } = useUser(); // Access user from UserContext

  return (
    <div className="mainBody">
      <Router>
        <Header user={user} />
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
            element={user ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/house/:houseId"
            element={user ? <HouseDetails /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
