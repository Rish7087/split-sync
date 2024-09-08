const Expense = require('../models/expenses.js');

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
