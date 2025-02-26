const Expense = require('../models/expense'); // Ensure this is your Expense model
const ExpenseList = require('../models/expenseList'); // Ensure this is your ExpenseList model
const User = require('../models/user'); // Ensure this is your User model

//Add Expense
exports.addExpense = async (req, res) => {
  console.log("Add expense request received");
  try {
    // console.log("Trying to add expense");
    
    const { title, total, paidBy, items, note, expenseListId, houseId, roomId } = req.body;
    
    // Ensure title, total, and paidBy are provided
    if (!title || !total || !paidBy) {
      return res.status(400).json({ error: 'Title, total, and paidBy are required fields.' });
    }

    // Creating the new expense object
    const newExpense = new Expense({
      title,
      total,
      paidBy,
      items,
      note: note || 'NA', // Default note if not provided
      houseId: houseId || null, // Default to null for personal expenses
      roomId: roomId || null,   // Default to null for personal expenses
      expenseListId: expenseListId || null // Optional, depending on personal or group expense
    });

    const savedExpense = await newExpense.save();

    // Only associate with expense list if `expenseListId` is provided
    if (expenseListId) {
      await ExpenseList.findByIdAndUpdate(
        expenseListId,
        { $push: { expenses: savedExpense._id } },
        { new: true }
      );
    }

    res.status(201).json({ message: 'Expense added successfully', expense: savedExpense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Error adding expense', details: error.message });
  }
};

// Controller to delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    // Find and delete the expense by ID
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.status(200).json({
      message: 'Expense deleted successfully!',
      expense: deletedExpense
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Error deleting expense', details: error.message });
  }
};

/// Controller to fetch all expenses and user details
exports.fetchAllExpenses = async (req, res) => {
  try {
    const { houseId, roomId } = req.query;

    const query = {};
    if (houseId) query.houseId = houseId;
    if (roomId) query.roomId = roomId;

    const expenses = await Expense.find(query)
      .populate('paidBy', 'name profilePic') // Added profilePic to the populated fields
      .lean();

    // Extract user IDs from expenses
    const userIds = [...new Set(expenses.map(expense => expense.paidBy._id))];

    // Fetch user details for the paidBy field
    const users = await User.find({ _id: { $in: userIds } }).lean();

    // Create a user map for quick lookup
    const userMap = {};
    users.forEach(user => {
      userMap[user._id] = { name: user.name, profilePic: user.profilePic }; // Added profilePic to the map
    });

    // Send back both expenses and the mapped user data
    res.status(200).json({
      expenses,
      users: userMap
    });
  } catch (error) {
    console.error('Error fetching all expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
