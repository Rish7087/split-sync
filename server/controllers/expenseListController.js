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
      members
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
