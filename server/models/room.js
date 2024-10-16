const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the room
  houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House', required: true }, // Reference to the associated House
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users in the room
  expenseLists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExpenseList' }], // List of expense lists for the room
});

module.exports = mongoose.model('Room', roomSchema);
