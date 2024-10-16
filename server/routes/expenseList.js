const express = require('express');
const router = express.Router();
const expenseListController = require('../controllers/expenseListController');

// Route to create a new expense list
router.post('/create', expenseListController.createExpenseList);

// Route to fetch all expense lists for a house or room
router.get('/:houseId', expenseListController.fetchExpenseListsByHouse);

module.exports = router;
