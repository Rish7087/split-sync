const ExpenseList = require('../models/expenseList');

// Controller to create a new expense list
exports.createExpenseList = async (req, res) => {
  try {
    const { title, startDate, endDate, houseId, members } = req.body;

    const newExpenseList = new ExpenseList({
      title,
      startDate,
      endDate,
      houseId,
      members,
    });

    const savedExpenseList = await newExpenseList.save();
    res.status(201).json({ message: 'Expense list created successfully', expenseList: savedExpenseList });
  } catch (error) {
    res.status(500).json({ error: 'Error creating expense list', details: error.message });
  }
};

// Controller to fetch all expense lists for a house
exports.fetchExpenseListsByHouse = async (req, res) => {
  try {
    const { houseId } = req.params;
    const expenseLists = await ExpenseList.find({ houseId }).select('title _id').lean(); // Select title and _id
    res.status(200).json(expenseLists); // Send the expense lists with title and _id
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expense lists', details: error.message });
  }
};

// Controller to fetch expense list by ID and populate expenses
exports.fetchExpenseListById = async (req, res) => {
  try {
    const { expenseListId } = req.params;

    // Fetch the expense list and populate the expenses with the `paidBy` user details
    const expenseList = await ExpenseList.findById(expenseListId)
      .populate({
        path: 'expenses',
        populate: {
          path: 'paidBy',  // Populate the paidBy field with user details
          select: 'username profilePic'  // Select only name and profilePic fields from User model
        }
      })
      .lean();

    if (!expenseList) {
      return res.status(404).json({ error: 'Expense list not found' });
    }

    res.status(200).json(expenseList);
  } catch (error) {
    console.error("Error fetching expense list:", error);
    res.status(500).json({ error: 'Error fetching expense list', details: error.message });
  }
};

