const User = require('../models/user');

// Google auth callback
exports.googleCallback = (req, res) => {
  if (!req.user) {
    console.log("Authentication failed, redirecting to /login");
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }

  const { _id, name, email, profilePic } = req.user;
  const redirectUrl = `${process.env.CLIENT_URL}/home?userId=${_id}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&profilePic=${encodeURIComponent(profilePic)}`;
  console.log("Redirecting to:", redirectUrl);
  return res.redirect(redirectUrl);
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
