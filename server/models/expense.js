const mongoose = require('mongoose');

// Define the items sub-schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the item
  price: { type: Number, required: true }, // Price of the item
});

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  total: { type: Number, required: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who paid
  items: { type: [itemSchema], required: true }, // Array of item objects
  date: { type: Date, default: Date.now },
  note: { type: String, default: "NA" },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null }, // Optional reference to a Room
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true }, // Required reference to House
  expenseListId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseList', default: null }, // Optional reference to ExpenseList
});

module.exports = mongoose.model('Expense', expenseSchema);
