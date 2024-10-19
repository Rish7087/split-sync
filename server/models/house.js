const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the house
  admin: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users in the house
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }], // Rooms in the house
  expenseLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseList' }], // List of expense lists for the house
});

module.exports = mongoose.model('House', houseSchema);
