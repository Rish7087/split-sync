import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserFromCookie } from "../utils/cookieUtils";
import AddExpenseModal from "../components/AddExpenseModal.jsx";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { Avatar, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./HomePage.css";

const HomePage = () => {
  const [userData, setUserData] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [viewItemsFor, setViewItemsFor] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const fetchUserProfiles = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/all");
      const data = await response.json();

      const profilesObject = data.reduce((acc, profile) => {
        acc[profile._id] = {
          ...profile,
          profilePic: profile.img, // Fetch image URL from database
        };
        return acc;
      }, {});

      setUserProfiles(profilesObject);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const calculateTotals = () => {
    let totalExpenses = 0;
    const userExpenses = {};
  
    // Calculate total expenses and individual user expenses
    allExpenses.forEach((expense) => {
      totalExpenses += expense.total;
      if (!userExpenses[expense.paidBy]) {
        userExpenses[expense.paidBy] = 0;
      }
      userExpenses[expense.paidBy] += expense.total;
    });
  
    // Initialize any missing users with 0 expenses
    Object.keys(userProfiles).forEach((userId) => {
      if (!userExpenses[userId]) {
        userExpenses[userId] = 0;
      }
    });
  
    const avgExpense = totalExpenses / Object.keys(userProfiles).length;
    const userBalances = {};
  
    // Calculate each user's balance (paid - average)
    Object.keys(userProfiles).forEach((userId) => {
      userBalances[userId] = userExpenses[userId] - avgExpense;
    });
  
    return { totalExpenses, userExpenses, userBalances };
  };
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUserData();
      await fetchUserProfiles(); // Fetch dynamic user profiles
      await fetchAllExpenses();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading || !userData) {
    return <div>Loading...</div>;
  }

  const { totalExpenses, userExpenses, userBalances } = calculateTotals();

  // Define your custom theme
  const theme = createTheme({
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: "var(--primary-color)",
            color: "var(--text-color)",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "var(--text-color)",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: "var(--text-color)",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="homepage">
        {userData && (
          <Paper elevation={6} className="user-info bgPrimary">
            <div>
              <Avatar
                src={userProfiles[userData._id]?.profilePic}
                alt={userData.name}
                sx={{ width: 56, height: 56 }}
              />
            </div>

            <div className="about">
              <div>
                <Typography variant="h5">{userData.name}</Typography>
                <Typography variant="body1">
                  Total Expenses: ₹{userData.totalSpent?.toFixed(2)}
                </Typography>
              </div>
            </div>
          </Paper>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowModal(true)}
          sx={{ margin: "20px 0" }}
        >
          Add Expense
        </Button>
        {showModal && (
          <AddExpenseModal
            open={showModal}
            onClose={() => setShowModal(false)}
            refreshExpenses={fetchAllExpenses}
          />
        )}

        {/* First Table: Display all expenses */}
        <TableContainer component={Paper} className="bgPrimary">
          <Table sx={{ minWidth: 650 }} aria-label="expenses table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Paid By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allExpenses.length > 0 ? (
                allExpenses.map((expense) => (
                  <React.Fragment key={expense._id}>
                    <TableRow>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell>{expense.title}</TableCell>
                      <TableCell>₹{expense.total.toFixed(2)}</TableCell>
                      <TableCell>
                        {userProfiles[expense.paidBy]?.name || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            setViewItemsFor(
                              viewItemsFor === expense._id ? null : expense._id
                            )
                          }
                        >
                          {viewItemsFor === expense._id
                            ? "Hide Items"
                            : "View Items"}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {viewItemsFor === expense._id && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Table size="small" aria-label="items table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Price</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {expense.items.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>
                                    ₹{item.price.toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No expenses available</TableCell>
                </TableRow>
              )}
              {/* Total expenses row at the end of the first table */}
              <TableRow>

  <TableCell colSpan={2} align="left">
    <Typography
      variant="h6"
      component="span"
      style={{ display: "inline-flex", whiteSpace: "nowrap", textAlign: "left" }}
    >
      Total Expenses: ₹ 
      {allExpenses.reduce((sum, expense) => sum + expense.total, 0).toFixed(2)}{" "}
      {"\u00A0\u00A0"} 
     {"  &  "}  {"\u00A0\u00A0"} {"Per person: ₹"}
    
      {(
        allExpenses.reduce((sum, expense) => sum + expense.total, 0) / 4
      ).toFixed(2)}
    </Typography>
  </TableCell>
</TableRow>


            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer
          component={Paper}
          className="bgPrimary"
          sx={{ marginTop: "20px" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="totals table">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Total Paid</TableCell>
                <TableCell>Owes/Owned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(userProfiles).map((userId) => (
                <TableRow key={userId}>
                  <TableCell>
                    {userProfiles[userId]?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    ₹{(userExpenses[userId] || 0).toFixed(2)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: (userBalances[userId] || 0) < 0 ? "red" : "green",
                    }}
                  >
                    {(userBalances[userId] || 0) < 0
                      ? `Owes ₹${Math.abs(userBalances[userId] || 0).toFixed(
                          2
                        )}`
                      : `Owned ₹${(userBalances[userId] || 0).toFixed(2)}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </ThemeProvider>
  );
};

export default HomePage;
