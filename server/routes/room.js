const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Route to create a room in a house
router.post('/create', roomController.createRoom);

// Route to fetch all rooms for a house
router.get('/:houseId/rooms', roomController.fetchRoomsByHouse);

// Route to fetch details of a specific room
router.get('/:roomId', roomController.getRoomDetails);

module.exports = router;
