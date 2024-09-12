const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ensure this path is correct
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

// Get all users
router.get('/all', userController.fetchAll); // Ensure `fetchAll` is defined in userController

// Update user data by ID
router.put('/:id/update',upload.single('profilePic'), userController.updateUser);

// Validate PIN
router.post('/:id/validate', userController.validatePin); // Ensure `validatePin` is defined in userController

// Fetch User Data
router.get('/:id/data', userController.getUserData); // Ensure `getUserData` is defined in userController

module.exports = router;
