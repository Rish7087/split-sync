const User = require('../models/user');

// Google auth callback
exports.googleCallback = (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }
  
  // Redirect to home directly
  return res.redirect(`${process.env.CLIENT_URL}/home`);
};

// Logout logic
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};

// Fetch user info
exports.getUserInfo = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};
