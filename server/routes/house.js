const express = require('express');
const router = express.Router();
const houseController = require('../controllers/houseController');

// Route to create a new house
router.post('/create', houseController.createHouse);

// Route to fetch all houses for a user
router.get('/all/:userId', houseController.fetchHousesByUser);

// Route to fetch details of a specific house
router.get('/:houseId', houseController.getHouseDetails);

module.exports = router;
