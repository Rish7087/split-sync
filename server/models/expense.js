const mongoose = require('mongoose');

// Define the items sub-schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the item
  price: { type: Number, required: true }, // Price of the item
});

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  total: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [itemSchema], required: true }, // Array of item objects
  date: { type: Date, default: Date.now },
  note: { type: String, default: "NA" },
});

module.exports = mongoose.model('Expense', expenseSchema);
