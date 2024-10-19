import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material';
import AddHouseMembers from '../components/AddHouseMember';
import AddExpenseModal from '../components/AddExpenseModal';

const HouseDetails = () => {
  const { houseId } = useParams();
  const [house, setHouse] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [userBalances, setUserBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Fetch current user from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch house details when the component mounts
  useEffect(() => {
    fetchHouseDetails();
  }, []);

  // Fetch house details
  const fetchHouseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/house/${houseId}`);
      if (response.data) {
        setHouse(response.data);
        const { expenses, members } = response.data;
        if (expenses && members) {
          setAllExpenses(expenses); // Set expenses data
          calculateUserBalances(expenses, members); // Calculate balances
        } else {
          console.error('Expenses or members data missing in house details');
        }
      } else {
        console.error('House data is empty');
      }
    } catch (error) {
      console.error('Error fetching house details:', error);
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };

  const calculateUserBalances = (expenses, members) => {
    let totalExpenses = 0;
    const userExpenses = {};

    expenses.forEach((expense) => {
      totalExpenses += expense.total;
      userExpenses[expense.paidBy] = (userExpenses[expense.paidBy] || 0) + expense.total;
    });

    const avgExpense = totalExpenses / members.length;
    const balances = members.reduce((acc, member) => {
      acc[member._id] = (userExpenses[member._id] || 0) - avgExpense;
      return acc;
    }, {});

    setUserBalances(balances); // Update state with balances
  };

  const refreshHouseDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/house/${houseId}`);
      setHouse(response.data);
      setAllExpenses(response.data.expenses);
      calculateUserBalances(response.data.expenses, response.data.members);
    } catch (error) {
      console.error('Error refreshing house details:', error);
    }
  };

  const handleClearBalances = async () => {
    try {
      await axios.post(`http://localhost:8080/house/${houseId}/clear-expenses`);
      refreshHouseDetails();
    } catch (error) {
      console.error('Error clearing balances:', error);
    }
  };

  if (loading || !house) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5">House Details: {house.name}</Typography>

      <AddHouseMembers houseId={houseId} onMemberAdded={refreshHouseDetails} />

      <Typography variant="body1" style={{ marginTop: '10px' }}>
        Number of Members: {house.members.length}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowModal(true)}
        style={{ marginTop: '20px' }}
      >
        Add Expense
      </Button>

      {showModal && (
        <AddExpenseModal
          open={showModal}
          onClose={() => setShowModal(false)}
          refreshExpenses={refreshHouseDetails}
        />
      )}

      {allExpenses.length === 0 ? (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          No expenses available
        </Typography>
      ) : (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
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
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
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
                <TableCell colSpan={2}>₹{allExpenses.reduce((sum, exp) => sum + exp.total, 0).toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Total Paid</TableCell>
              <TableCell>Owes/Owned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {house.members.map((member) => (
              <TableRow key={member._id}>
                <TableCell>
                  <Avatar src={member.profilePic} />
                  {member.name}
                </TableCell>
                <TableCell>₹{(userBalances[member._id] || 0).toFixed(2)}</TableCell>
                <TableCell>
  {userBalances[member._id] !== undefined
    ? (userBalances[member._id] < 0
        ? `Owes ₹${Math.abs(userBalances[member._id]).toFixed(2)}`
        : `Owned ₹${userBalances[member._id].toFixed(2)}`)
    : 'No balance data'}
</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {currentUser?.role === 'admin' && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearBalances}
          style={{ marginTop: '20px' }}
        >
          Clear Balances
        </Button>
      )}
    </Paper>
  );
};

export default HouseDetails;
