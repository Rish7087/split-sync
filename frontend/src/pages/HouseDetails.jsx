import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
  Collapse,
  Box,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import AddHouseMembers from "../components/AddHouseMember";
import AddExpenseModal from "../components/AddExpenseModal";

const HouseDetails = () => {
  const { houseId } = useParams();
  const [house, setHouse] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [expenseLists, setExpenseLists] = useState([]);
  const [selectedExpenseList, setSelectedExpenseList] = useState(null);
  const [openRows, setOpenRows] = useState({});

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
    try {
      const response = await axios.get(
        `http://localhost:8080/expenselist/fetch/${expenseListId}`
      );
      setAllExpenses(response.data.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const calculateUserBalances = (expenses, members) => {
    const totalExpenses = {};
    const memberCount = members.length;
  
    members.forEach((member) => {
      totalExpenses[member._id] = {
        totalPaid: 0,
        name: member.name,
        profilePic: member.profilePic,
      };
    });
  
    expenses.forEach((expense) => {
      const paidBy = expense.paidBy._id;
      const total = expense.total;
      if (totalExpenses[paidBy]) {
        totalExpenses[paidBy].totalPaid += total;
      }
    });
  
    const totalPaid = Object.values(totalExpenses).reduce(
      (sum, member) => sum + member.totalPaid,
      0
    );
  
    const avgExpense = memberCount ? totalPaid / memberCount : 0;
  
    return members.map((member) => {
      const paid = totalExpenses[member._id]?.totalPaid || 0;
      const owed = avgExpense - paid;
  
      return {
        ...member,
        totalPaid: paid,
        balance: owed,
      };
    });
  };

  const refreshHouseDetails = async () => {
    try {
      await fetchHouseDetails();
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

  const toggleRowOpen = (expenseId) => {
    setOpenRows((prevState) => ({
      ...prevState,
      [expenseId]: !prevState[expenseId],
    }));
  };

  if (loading || !house) {
    return <Typography>Loading...</Typography>;
  }

  const userBalances = calculateUserBalances(allExpenses, house.members);

  // Calculate the total paid and average expense for display
  const totalPaid = userBalances.reduce((sum, member) => sum + member.totalPaid, 0);
  const avgExpense = totalPaid / house.members.length;

  return (
    <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h5">House Details: {house.name}</Typography>

      <AddHouseMembers houseId={houseId} onMemberAdded={refreshHouseDetails} />

      <Typography variant="body1" style={{ marginTop: "10px" }}>
        Number of Members: {house.members.length}
      </Typography>

      <FormControl fullWidth style={{ marginTop: "20px" }}>
        <InputLabel>Expense List</InputLabel>
        <Select value={selectedExpenseList} onChange={handleSelectExpenseList}>
          {house.expenseLists.map((expenseListId) => (
            <MenuItem key={expenseListId} value={expenseListId}>
              {expenseListId}
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

      {/* Paper Row for displaying Total Paid and Average Expense */}
      <Paper elevation={1} style={{ marginTop: "20px", padding: "15px" }}>
        <Typography variant="h6">Total Paid: ₹{totalPaid.toFixed(2)}</Typography>
        <Typography variant="h6">Average Expense: ₹{avgExpense.toFixed(2)}</Typography>
      </Paper>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell>Date</TableCell>
        <TableCell>Title</TableCell>
        <TableCell>Total</TableCell>
        <TableCell>Paid By</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {allExpenses.map((expense) => (
        <React.Fragment key={expense._id}>
          <TableRow>
            <TableCell />
            <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
            <TableCell>{expense.title}</TableCell>
            <TableCell>₹{expense.total.toFixed(2)}</TableCell>
            <TableCell>
              <Avatar src={expense.paidBy.profilePic} />
              {expense.paidBy.name}
            </TableCell>
            <TableCell>
              {/* This button is moved below to show after other columns */}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => toggleRowOpen(expense._id)}
              >
                {openRows[expense._id] ? "Hide Items" : "View Items"}
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
              <Collapse in={openRows[expense._id]} timeout="auto" unmountOnExit>
                <Box margin={2}>
                  <Typography variant="subtitle1">Items:</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item Name</TableCell>
                        <TableCell>Cost</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {expense.items?.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>₹{item.price?.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      {/* User Balances Table */}
<TableContainer component={Paper} style={{ marginTop: "20px" }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Member</TableCell>
        <TableCell>Total Paid</TableCell>
        <TableCell>Balance</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {userBalances.map((member) => (
        <TableRow key={member._id}>
          <TableCell>
            {/* {console.log(member.profilePic)} */}
            <Avatar src={member.profilePic} />
            {member.name}
          </TableCell>
          <TableCell>₹{member.totalPaid.toFixed(2)}</TableCell>
          <TableCell
            style={{
              color: member.balance > 0 ? "red" : "green",
              fontWeight: "bold",
            }}
          >
            {member.balance > 0
              ? `Owned: ₹${member.balance.toFixed(2)}`
              : `Owes: ₹${Math.abs(member.balance).toFixed(2)}`}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      {/* Admin Controls */}
      {currentUser && house.admin === currentUser._id && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearBalances}
          style={{ marginTop: "20px" }}
        >
          Clear Balances & Start New Expense List
        </Button>
      )}
    </Paper>
  );
};

export default HouseDetails;
