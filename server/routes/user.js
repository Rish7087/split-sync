const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ensure this path is correct
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

// Get all users
router.get('/all', userController.fetchAll);

// Update user data by ID
router.put('/:id/update', upload.single('profilePic'), userController.updateUser);

// Fetch User Data
router.get('/:id/data', userController.getUserData);

//Fetch User Data
router.get('/:id/houses',userController.getUserHouses);

module.exports = router;
 