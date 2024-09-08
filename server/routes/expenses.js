const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expensesController');

// Route to add an expense
router.post('/add', expenseController.addExpense);

// Route to delete an expense by ID
router.delete('/delete/:id', expenseController.deleteExpense);

module.exports = router;
