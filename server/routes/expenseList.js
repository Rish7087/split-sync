const express = require('express');
const router = express.Router();
const expenseListController = require('../controllers/expenseListController.js');

// Route to create a new expense list
router.post('/create', expenseListController.createExpenseList);

// Route to fetch all expense lists for a house
router.get('/:houseId', expenseListController.fetchExpenseListsByHouse);

// Route to fetch a specific expense list by ID
router.get('/fetch/:expenseListId', expenseListController.fetchExpenseListById);

module.exports = router;
