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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddHouseMembers from "../components/AddHouseMember";
import AddExpenseModal from "../components/AddExpenseModal";
import ButtonMenu from "../components/ButtonMenu";




const HouseDetails = () => {
  const { houseId } = useParams();
  const [house, setHouse] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [expenseLists, setExpenseLists] = useState([]);
  const [selectedExpenseList, setSelectedExpenseList] = useState("");
  const [openRows, setOpenRows] = useState({});

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    fetchHouseDetails();
  }, []);

  const fetchHouseDetails = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/house/${houseId}`);
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

  const fetchExpenseLists = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/house/${houseId}/expense-lists`);
      setExpenseLists(response.data); // Store full list details
    } catch (error) {
      console.error("Error fetching expense lists:", error);
    }
  };
  useEffect(() => {
    fetchExpenseLists();
  }, [houseId]);
  
 
  const handleSelectExpenseList = (event) => {
    const expenseListId = event.target.value;
    setSelectedExpenseList(expenseListId);
    fetchExpenses(expenseListId);
  };

  const fetchExpenses = async (expenseListId) => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/expenselist/fetch/${expenseListId}`
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


  const [openDialog, setOpenDialog] = useState(false);
const [newExpenseListTitle, setNewExpenseListTitle] = useState("");

const handleOpenDialog = () => {
  setNewExpenseListTitle(""); // Reset input field
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
};

  const handleConfirmClearBalances = async () => {
    if (!newExpenseListTitle.trim()) {
      alert("Please enter a valid expense list name.");
      return;
    }
  
    try {
      const response = await axios.post(`${SERVER_URL}/house/${houseId}/clear-expenses`, {
        title: newExpenseListTitle, // Send user-defined title
      });
  
      if (response.status === 201) {
        alert("New Expense List Created Successfully!");
        refreshHouseDetails();
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error clearing balances:", error);
    } finally {
      handleCloseDialog();
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
  const totalPaid = userBalances.reduce(
    (sum, member) => sum + member.totalPaid,
    0
  );
  const avgExpense = totalPaid / house.members.length;

  return (
    <Paper
      elevation={3}
      style={{
        padding: "20px",
        marginTop: "20px",
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        borderRadius: "15px",
        boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.1)",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          color: "white",
        }}
      >
        <ButtonMenu />
      </div>

      <Typography variant="h5">House Details: {house.name}</Typography>
      {currentUser && house.admin === currentUser._id && (
        <AddHouseMembers
          houseId={houseId}
          onMemberAdded={refreshHouseDetails}
        />
      )}
      <Typography variant="body1" style={{ marginTop: "10px" }}>
        Number of Members: {house.members.length}
      </Typography>

      <FormControl fullWidth style={{ marginTop: "20px" }}>
  <InputLabel>Expense List</InputLabel>
  <Select value={selectedExpenseList} onChange={handleSelectExpenseList}>
    {expenseLists.map((expenseList) => (
      <MenuItem key={expenseList._id} value={expenseList._id}>
        {expenseList.title} {/* Show name instead of ID */}
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
      <Paper
        elevation={1}
        style={{
          marginTop: "20px",
          width: "90%",
          maxWidth: "800px",
          padding: "20px",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          borderRadius: "15px",
          color: "white",
          boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6">
          Total Paid: ₹{totalPaid.toFixed(2)}
        </Typography>
        <Typography variant="h6">
          Average Expense: ₹{avgExpense.toFixed(2)}
        </Typography>
      </Paper>

      <TableContainer
        component={Paper}
        sx={{
          marginTop: "15px",
          width: "97%",
          background: "rgba(255, 255, 255, 0.15)", // Transparent white
          backdropFilter: "blur(10px)", // Glass effect
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Soft shadow
          padding: "10px",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "rgba(255, 255, 255, 0.3)" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }} />
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Title
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Total
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Paid By
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allExpenses.map((expense) => (
              <React.Fragment key={expense._id}>
                <TableRow sx={{ background: "rgba(255, 255, 255, 0.1)" }}>
                  <TableCell />
                  <TableCell sx={{ color: "#fff" }}>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>{expense.title}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>
                    ₹{expense.total.toFixed(2)}
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#fff",
                    }}
                  >
                    <Avatar src={expense.paidBy.profilePic} />
                    {expense.paidBy.username}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "#fff",
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        "&:hover": {
                          borderColor: "#fff",
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                        },
                      }}
                      onClick={() => toggleRowOpen(expense._id)}
                    >
                      {openRows[expense._id] ? "Hide Items" : "View Items"}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={6}
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                  >
                    <Collapse
                      in={openRows[expense._id]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={2}>
                        <Typography variant="subtitle1" sx={{ color: "#fff" }}>
                          Items:
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow
                              sx={{ background: "rgba(255, 255, 255, 0.2)" }}
                            >
                              <TableCell
                                sx={{ color: "#fff", fontWeight: "bold" }}
                              >
                                Item Name
                              </TableCell>
                              <TableCell
                                sx={{ color: "#fff", fontWeight: "bold" }}
                              >
                                Cost
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {expense.items?.map((item) => (
                              <TableRow
                                key={item._id}
                                sx={{ background: "rgba(255, 255, 255, 0.1)" }}
                              >
                                <TableCell sx={{ color: "#fff" }}>
                                  {item.name}
                                </TableCell>
                                <TableCell sx={{ color: "#fff" }}>
                                  ₹{item.price?.toFixed(2)}
                                </TableCell>

                              </TableRow>
                              
                            ))}
                          </TableBody>
                        </Table>
                        <Typography variant="subtitle1" sx={{ color: "#fff" , marginTop: "5px"}}>
                          Note: {expense.note}
                        </Typography>
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
      <TableContainer
        component={Paper}
        sx={{
          width: "97%",
          marginTop: "20px",
          background: "rgba(255, 255, 255, 0.15)", // Transparent white
          backdropFilter: "blur(10px)", // Glass effect
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Soft shadow
          padding: "10px",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "rgba(255, 255, 255, 0.3)" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Member
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Total Paid
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Balance
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userBalances.map((member) => (
              <TableRow
                key={member._id}
                sx={{ background: "rgba(255, 255, 255, 0.1)" }}
              >
                <TableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#fff",
                  }}
                >
                  <Avatar src={member.profilePic} />
                  {member.username}
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  ₹{member.totalPaid.toFixed(2)}
                </TableCell>
                <TableCell
                  sx={{
                    color:
                      member.balance > 0
                        ? "rgba(148, 13, 13, 0.51)"
                        : "rgba(23, 131, 9, 0.67)", // Red for owned, Green for owes
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

      

{currentUser && house.admin === currentUser._id && (
  <>
    <Button
      variant="outlined"
      color="secondary"
      onClick={handleOpenDialog}
      sx={{
        marginTop: "20px",
        background: "rgba(203, 112, 33, 0.09)",
        backdropFilter: "blur(10px)",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        padding: "10px 20px",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        color: "#fff",
        fontWeight: "bold",
        textTransform: "none",
        transition: "0.3s",
        "&:hover": {
          background: "rgba(207, 131, 17, 0.27)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
        },
      }}
    >
      Clear Balances & Start New Expense List
    </Button>

    {/* Dialog for Expense List Name */}
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>Enter New Expense List Name</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Expense List Title"
          variant="outlined"
          value={newExpenseListTitle}
          onChange={(e) => setNewExpenseListTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirmClearBalances} color="primary" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </>
)}

    </Paper>
  );
};

export default HouseDetails;
