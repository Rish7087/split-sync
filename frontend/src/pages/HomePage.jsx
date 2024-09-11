import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserFromCookie } from "../utils/cookieUtils";
import user1Img from "../assets/user1.jpeg";
import user2Img from "../assets/user2.jpeg";
import user3Img from "../assets/user3.jpeg";
import user4Img from "../assets/user4.jpeg";
import AddExpenseModal from "../components/AddExpenseModal.jsx"; // Import the new modal component
import "./HomePage.css";

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewItemsFor, setViewItemsFor] = useState(null); // Track the expense ID for which items are viewed

  const userProfiles = {
    "66ddafd07489b1709fdbbbe9": { name: "Rishabh", img: user1Img },
    "66ddafd07489b1709fdbbbea": { name: "Utkarsh", img: user2Img },
    "66ddafd07489b1709fdbbbeb": { name: "Krishna", img: user3Img },
    "66ddafd07489b1709fdbbbec": { name: "Lakshay", img: user4Img },
  };

  const fetchUserData = async () => {
    try {
      const user = getUserFromCookie("currentUser");
      if (user && user._id) {
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

  useEffect(() => {
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
              className="userprofile-pic"
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

      <div className="homepanel">
        <button onClick={() => setShowModal(true)}>Add Expense</button>{" "}
        {/* Add Expense button */}
        {showModal && (
          <AddExpenseModal
            onClose={() => setShowModal(false)}
            refreshExpenses={fetchAllExpenses}
          />
        )}
        <div className="expenses-table">
          <h2>All Expenses</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Total</th>
                <th>Paid By</th>
                <th>Actions</th> {/* New column for actions */}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(allExpenses) && allExpenses.length > 0 ? (
                allExpenses.map((expense) => (
                  <React.Fragment key={expense._id}>
                    <tr>
                      <td>{new Date(expense.date).toLocaleDateString()}</td>
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
                      <td>
                        <button
                          onClick={() =>
                            setViewItemsFor(
                              viewItemsFor === expense._id ? null : expense._id
                            )
                          }
                        >
                          {viewItemsFor === expense._id
                            ? "Hide Items"
                            : "View Items"}
                        </button>
                      </td>
                    </tr>
                    {viewItemsFor === expense._id && (
                      <tr>
                        <td colSpan="5">
                          <table className="items-table">
                            <thead>
                              <tr>
                                <th>Item Name</th>
                                <th>Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {expense.items.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.name}</td>
                                  <td>${item.price.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No expenses available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
