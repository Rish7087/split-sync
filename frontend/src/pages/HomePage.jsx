import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserFromCookie } from '../utils/cookieUtils'; // Adjust the import path

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = getUserFromCookie('currentUser');
        if (user && user._id) {
          setSelectedProfile(user._id);
          const response = await axios.get(`http://localhost:8080/user/${user._id}/data`);
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchAllExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:8080/expenses/all');
        setAllExpenses(response.data.expenses || []);
      } catch (error) {
        console.error('Error fetching all expenses:', error);
      }
    };

    fetchUserData();
    fetchAllExpenses();
  }, []);

  return (
    <div className="homepage">
      <div className="user-info">
        {userData && (
          <>
            <img src={userData.profilePic || 'default-profile-pic.jpg'} alt={userData.name} className="profile-pic" />
            <h1>{userData.name}</h1>
            <p>Total Expenses: ${userData.totalSpent.toFixed(2)}</p>
          </>
        )}
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
              allExpenses.map(expense => (
                <tr key={expense._id}>
                  <td>{expense.title}</td>
                  <td>${expense.total.toFixed(2)}</td>
                  <td>{expense.paidBy}</td>
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
    </div>
  );
};

export default HomePage;
