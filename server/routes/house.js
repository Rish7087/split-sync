const express = require('express');
const router = express.Router();
const houseController = require('../controllers/houseController');

// Route to create a new house
router.post('/create', houseController.createHouse);

// Route to fetch all houses for a user
router.get('/all/:userId', houseController.fetchHousesByUser);

// Route to fetch details of a specific house
router.get('/:houseId', houseController.getHouseDetails);

// Route to fetch details of a specific house
router.post('/:houseId/clear-expenses', houseController.clearBalance);

// Route to fetch  expense lists of a house
router.get('/:houseId/expense-lists', houseController.fetchExpenseLists);

// Route to add new member to the a house
router.post('/add-member', houseController.addHouseMember);
module.exports = router;
