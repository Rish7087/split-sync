import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserFromCookie } from "../utils/cookieUtils"; // Adjust the import path
import user1Img from "../assets/user1.jpeg";
import user2Img from "../assets/user2.jpeg";
import user3Img from "../assets/user3.jpeg";
import user4Img from "../assets/user4.jpeg";
import "./HomePage.css";

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Mapping user IDs to their images and names
  const userProfiles = {
    "66ddafd07489b1709fdbbbe9": { name: "Rishabh", img: user1Img },
    "66ddafd07489b1709fdbbbea": { name: "Utkarsh", img: user2Img },
    "66ddafd07489b1709fdbbbeb": { name: "Krishna", img: user3Img },
    "66ddafd07489b1709fdbbbec": { name: "Lakshay", img: user4Img },
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getUserFromCookie("currentUser");
        if (user && user._id) {
          setSelectedProfile(user._id);
          const response = await axios.get(
            `http://localhost:8080/user/${user._id}/data`
          );
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchAllExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/expenses/all");
        setAllExpenses(response.data.expenses || []);
      } catch (error) {
        console.error("Error fetching all expenses:", error);
      }
    };

    fetchUserData();
    fetchAllExpenses();
  }, []);

  return (
    <div className="homepage">
      <>
        {userData && (
          <div className="user-info">
            <img
              src={userProfiles[userData._id]?.img || "default-profile-pic.jpg"}
              alt={userData.name}
              className="profile-pic"
            />
            <div className="about">
              <h1>{userData.name}</h1>
              <div>
                <p>Total Expenses: ${userData.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </>

      <div className="panel">
        <div className="groupCon">
          <h3>Groups</h3>
          <div className="group"></div>
          <div className="group"></div>
          <div className="group"></div>
          <div className="group"></div>
        </div>
        <div className="expenses-table">
          <h2>All Expenses</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Total</th>
                <th>Paid By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(allExpenses) && allExpenses.length > 0 ? (
                allExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.title}</td>
                    <td>${expense.total.toFixed(2)}</td>
                    <td>
                      <img
                        src={
                          userProfiles[expense.paidBy]?.img ||
                          "default-profile-pic.jpg"
                        }
                        alt={userProfiles[expense.paidBy]?.name || "Unknown"}
                        className="small-profile-pic"
                      />{" "}
                      {userProfiles[expense.paidBy]?.name || "Unknown"}
                    </td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No expenses available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="piechart">
          <h3>Pie Chart</h3>
          <div className="pie"></div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
