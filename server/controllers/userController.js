const User = require('../models/user');
const Expense = require('../models/expense'); // Ensure this path is correct
const { cloudinary } = require('../cloudConfig');

// Fetch all users
exports.fetchAll = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Fetch user data
exports.getUserData = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const expenses = await Expense.find({ paidBy: userId }).lean();
    const totalExpenses = expenses.reduce((total, expense) => total + expense.total, 0);

    res.status(200).json({
      _id: userId,
      name: user.name,
      totalSpent: totalExpenses,
      expenses: expenses
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user data
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
    if (req.file) {
      updates.profilePic = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};
