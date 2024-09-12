const User = require('../models/user');
const Expense = require('../models/expense');
const {cloudinary} = require("../cloudConfig")
// Fetch all users
exports.fetchAll = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Validate PIN
exports.validatePin = async (req, res) => {
  const { pin } = req.body;
  const userId = req.params.id;

  console.log(`User ID: ${userId}, PIN from request: '${pin}'`); // Log PIN from request

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User PIN from database: '${user.pin}'`); // Log PIN from database

    if (user.pin === pin) {
      res.json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid PIN' });
    }
  } catch (error) {
    console.error('Error validating PIN:', error);
    res.status(500).json({ message: 'Error validating PIN' });
  }
};


// Fetch user data
exports.getUserData = async (req, res) => {
  const userId = req.params.id; // Adjusted to match parameter name in route

  try {
    // Fetch the current user's data
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch expenses for the current user
    const expenses = await Expense.find({ paidBy: userId }).lean();

    // Calculate total expenses
    const totalExpenses = expenses.reduce((total, expense) => total + expense.total, 0);

    res.status(200).json({
      _id: userId,
      name: user.name,
      totalSpent: totalExpenses,
      expenses: expenses
    });
  } catch (error) {
    console.error('Error fetching user data and expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body; // This contains name and other updates

  try {
    // Check if there's an uploaded file (profilePic)
    if (req.file) {
      // req.file.path contains the Cloudinary URL
      updates.profilePic = req.file.path;
    }

    // Update the user in the database with the new info
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true, // Return the updated document
      runValidators: true, // Run model validators
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};