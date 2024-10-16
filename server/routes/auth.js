const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require('../controllers/authController');

// Google auth route
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

// Google auth callback route
router.get('/google/callback', passport.authenticate('google', { session: true }), authController.googleCallback);

// Logout route
router.get("/logout", authController.logout);

// User info route
router.get('/user', authController.getUserInfo);

module.exports = router;
