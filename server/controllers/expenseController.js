const Expense = require('../models/expenses'); // Ensure this is your Expense model
const User = require('../models/user'); // Ensure this is your User model

// Controller to add an expense
exports.addExpense = async (req, res) => {
  try {
    const { items, total, paidBy } = req.body;

    // Create a new expense
    const newExpense = new Expense({
      items,
      total,
      paidBy
    });

    // Save the expense
    const savedExpense = await newExpense.save();

    res.status(201).json({
      message: 'Expense added successfully!',
      expense: savedExpense
    });
  } catch (error) {
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
    res.status(500).json({ error: 'Error deleting expense', details: error.message });
  }
};

// Controller to fetch all expenses and user details
exports.fetchAll = async (req, res) => {
  try {
    // Fetch all expenses
    const expenses = await Expense.find({}).lean();

    // Extract user IDs from expenses
    const userIds = [...new Set(expenses.map(expense => expense.paidBy))];

    // Fetch user details for the paidBy field
    const users = await User.find({ _id: { $in: userIds } }).lean();

    // Create a user map for quick lookup
    const userMap = {};
    users.forEach(user => {
      userMap[user._id] = { name: user.name };
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