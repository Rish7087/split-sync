import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddHouseMembers from "../components/AddHouseMember";
import AddExpenseModal from "../components/AddExpenseModal";

const HouseDetails = () => {
  const { houseId } = useParams();
  const [house, setHouse] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedExpenseList, setSelectedExpenseList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    fetchHouseDetails();
  }, []);

  const fetchHouseDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/house/${houseId}`
      );
      if (response.data) {
        setHouse(response.data);
        const recentExpenseListId =
          response.data.expenseLists[response.data.expenseLists.length - 1];
        setSelectedExpenseList(recentExpenseListId);
        await fetchExpenses(recentExpenseListId);
      } else {
        console.error("House data is empty");
      }
    } catch (error) {
      console.error("Error fetching house details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectExpenseList = (event) => {
    const expenseListId = event.target.value;
    setSelectedExpenseList(expenseListId);
    fetchExpenses(expenseListId);
  };

  const fetchExpenses = async (expenseListId) => {
    console.log("Trying to fetch:", expenseListId);
    try {
      const response = await axios.get(
        `http://localhost:8080/expenselist/fetch/${expenseListId}`
      );
      console.log("Fetched expenses: ", response.data);
      setAllExpenses(response.data.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const calculateUserBalances = (expenses, members) => {
    const totalExpenses = {};
    const memberCount = members.length;

    // Initialize total paid for each member
    members.forEach(member => {
      totalExpenses[member._id] = {
        totalPaid: 0,
        name: member.name,
        profilePic: member.profilePic,
      };
    });

    // Calculate total paid by each member
    expenses.forEach(expense => {
      const paidBy = expense.paidBy; // Member who paid
      const total = expense.total;

      // Add total paid to the corresponding member
      if (totalExpenses[paidBy]) {
        totalExpenses[paidBy].totalPaid += total;
      }
    });

    // Calculate average expense
    const totalPaid = Object.values(totalExpenses).reduce((sum, member) => sum + member.totalPaid, 0);
    const avgExpense = totalPaid / memberCount || 0;

    // Prepare the balance information for display
    return members.map(member => {
      const paid = totalExpenses[member._id]?.totalPaid || 0;
      const owed = avgExpense - paid; // What each member owes or owns
      return {
        ...member,
        totalPaid: paid,
        balance: owed, // Positive if they own money, negative if they owe money
      };
    });
  };

  const refreshHouseDetails = async () => {
    try {
      await fetchHouseDetails(); // This fetches house and associated expenses
    } catch (error) {
      console.error("Error refreshing house details:", error);
    }
  };

  const handleClearBalances = async () => {
    try {
      await axios.post(`http://localhost:8080/house/${houseId}/clear-expenses`);
      refreshHouseDetails();
    } catch (error) {
      console.error("Error clearing balances:", error);
    }
  };

  if (loading || !house) {
    return <Typography>Loading...</Typography>;
  }

  const userBalances = calculateUserBalances(allExpenses, house.members);

  return (
    <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h5">House Details: {house.name}</Typography>

      <AddHouseMembers houseId={houseId} onMemberAdded={refreshHouseDetails} />

      <Typography variant="body1" style={{ marginTop: "10px" }}>
        Number of Members: {house.members.length}
      </Typography>

      {/* Dropdown to select expense list */}
      <FormControl fullWidth style={{ marginTop: "20px" }}>
        <InputLabel>Expense List</InputLabel>
        <Select value={selectedExpenseList} onChange={handleSelectExpenseList}>
          {house.expenseLists.map((expenseListId) => (
            <MenuItem key={expenseListId} value={expenseListId}>
              {expenseListId}{" "}
              {/* You can modify this to show a more descriptive name if needed */}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowModal(true)}
        style={{ marginTop: "20px" }}
      >
        Add Expense
      </Button>

      {showModal && (
        <AddExpenseModal
          open={showModal}
          onClose={() => setShowModal(false)}
          expenseListId={selectedExpenseList}
          refreshExpenses={refreshHouseDetails}
        />
      )}

      {Array.isArray(allExpenses) && allExpenses.length === 0 ? (
        <Typography variant="body1" style={{ marginTop: "20px" }}>
          No expenses available
        </Typography>
      ) : (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
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
              {allExpenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>₹{expense.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Avatar src={expense.paidBy.profilePic} />
                    {expense.paidBy.name}
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined">View Items</Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3}>Total Expenses</TableCell>
                <TableCell colSpan={2}>
                  ₹
                  {allExpenses
                    .reduce((sum, exp) => sum + exp.total, 0)
                    .toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Total Paid</TableCell>
              <TableCell>Owes/Owned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userBalances.map((member) => (
              <TableRow key={member._id}>
                <TableCell>
                  <Avatar src={member.profilePic} />
                  {member.name}
                </TableCell>
                <TableCell>
                  ₹{member.totalPaid.toFixed(2)}
                </TableCell>
                <TableCell>
                  {member.balance < 0
                    ? `Owes ₹${Math.abs(member.balance).toFixed(2)}`
                    : `Owned ₹${member.balance.toFixed(2)}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {currentUser && currentUser._id === house.admin && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearBalances}
          style={{ marginTop: "20px" }}
        >
          Clear Balances
        </Button>
      )}
    </Paper>
  );
};

export default HouseDetails;
