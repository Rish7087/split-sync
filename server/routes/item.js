// routes/item.routes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');

// Route to get all items
router.get('/', itemController.getAllItems);

// Route to add a new item
router.post('/add', itemController.addItem);

// Route to update an item by ID
router.put('/:id', itemController.updateItem);

// Route to delete an item by ID
router.delete('/:id', itemController.deleteItem);

module.exports = router;
