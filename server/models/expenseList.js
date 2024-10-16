const mongoose = require('mongoose');

const expenseListSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the expense list
  startDate: { type: Date, required: true }, // Start date of the expense tracking
  endDate: { type: Date, required: true }, // End date of the expense tracking
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true }, // Reference to House
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID
    owes: { type: Number, default: 0 }, // Amount owed by the member
    owned: { type: Number, default: 0 }, // Amount owned by the member
  }], // Array of members with their respective owes and owned amounts
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }], // List of expenses linked to this expense list
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});

module.exports = mongoose.model('ExpenseList', expenseListSchema);
