const mongoose = require("mongoose");

// Define the item schema
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

// Define the expense schema
const expenseSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    title: { // Title of the expense
        type: String,
        required: true
    },
    items: {
        type: [itemSchema], // Array of items
        required: true
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    paidBy: {
        type: String,
        required: true
    }
});

// Create the model
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
