const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Route to add an expense
router.post('/add', expenseController.addExpense);

// Route to delete an expense by ID
router.delete('/delete/:id', expenseController.deleteExpense);

// Route to fetch all expenses
router.get('/all', expenseController.fetchAllExpenses);

module.exports = router;
