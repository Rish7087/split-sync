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
    const expenseLists = await ExpenseList.find({ houseId }).lean();
    res.status(200).json(expenseLists);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expense lists', details: error.message });
  }
};

// Fetch list by ID and populate expenses
exports.fetchExpenseListById = async (req, res) => {
  try {
    const { expenseListId } = req.params; // Correctly destructure the ID from params
    // Use populate to get the related expenses
    const expenseList = await ExpenseList.findById(expenseListId)
      .populate('expenses') // Assuming 'expenses' is the field that stores the expense IDs
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

