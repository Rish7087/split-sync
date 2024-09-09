const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  pin: String,  // Ensure this is defined as a String
  profilePic: String,
  totalSpent: Number,
  // Other fields...
});

module.exports = mongoose.model('User', userSchema);
