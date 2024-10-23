const mongoose = require('mongoose');

const expenseListSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    default: 'expenselist1' // Default title
  },
  startDate: { 
    type: Date, 
    required: true, 
    default: Date.now // Default start date as current date
  },
  endDate: { 
    type: Date, 
    required: false,
    default: null  // Make it optional, added when clearing balance
  },
  houseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'House', 
    required: false 
  },
  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room', 
    required: false 
  },
  members: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    totalPaid: {
      type: Number,
      default: 0
    },
    owes: { 
      type: Number, 
      default: 0 
    },
    owned: { 
      type: Number, 
      default: 0 
    },
  }],
  expenses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Expense' 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('ExpenseList', expenseListSchema);
