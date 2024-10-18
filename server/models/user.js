const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true }, // Google ID for OAuth
  name: { type: String, required: true }, // User's display name
  email: { type: String, required: true }, // User's email
  profilePic: { type: String, required: false }, // URL to the user's profile picture
  personalExpenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }], // List of personal expenses
  owes: { type: Number, default: 0 }, // Total amount owed
  owned: { type: Number, default: 0 }, // Total amount owned
  totalExpense: { type: Number, default: 0 },
  houses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'House' }],
});

// Check if the model is already compiled to avoid errors
let User;
try {
  User = mongoose.model("User");
} catch (error) {
  User = mongoose.model("User", userSchema);
}

module.exports = User;
