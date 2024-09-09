const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ensure this path is correct

// Get all users
router.get('/all', userController.fetchAll); // Ensure `fetchAll` is defined in userController

// Validate PIN
router.post('/:id/validate', userController.validatePin); // Ensure `validatePin` is defined in userController

// Fetch User Data
router.get('/:id/data', userController.getUserData); // Ensure `getUserData` is defined in userController

module.exports = router;
