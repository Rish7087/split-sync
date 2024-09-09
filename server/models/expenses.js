const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  items: { type: String, required: true },
  total: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
