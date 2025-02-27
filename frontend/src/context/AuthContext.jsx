// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching user from server..."); // ✅ Debug
    axios
      .get(`${SERVER_URL}/auth/user`, { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          setUser(response.data.user);
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          setUser(null);
          sessionStorage.removeItem("user");
        }
      })
      .catch(() => {
        setUser(null);
        sessionStorage.removeItem("user");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};