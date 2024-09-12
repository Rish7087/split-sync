const mongoose = require('mongoose');
const User = require('./models/user');
const Expense = require('./models/expense');

const mongo_URI = "mongodb://localhost:27017/split-buddies";

// Connect to MongoDB
mongoose.connect(mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Expense.deleteMany({});

    // Create new users with profile picture URLs
    const users = await User.insertMany([
      { name: 'Rishabh', pin: '0001', totalSpent: 0, profilePic: '../assets/user1.jpeg' },
      { name: 'Utkarsh', pin: '0002', totalSpent: 0, profilePic: '../assets/user2.jpeg' },
      { name: 'Krishna', pin: '0003', totalSpent: 0, profilePic: '../assets/user3.jpeg' },
      { name: 'Lakshay', pin: '0004', totalSpent: 0, profilePic: '../assets/user4.jpeg' }
    ]);

    console.log('Users created:', users);

    // Create new expenses
    const expenses = await Expense.insertMany([
      {
        title: 'Dinner',
        total: 20.00,
        paidBy: users[0]._id,
        items: [
          { name: 'Pizza', price: 20.00 }
        ],
        note: 'Dinner for everyone',
        date: new Date()
      },
      {
        title: 'Groceries',
        total: 15.50,
        paidBy: users[1]._id,
        items: [
          { name: 'Milk', price: 1.50 },
          { name: 'Bread', price: 2.00 }
        ],
        note: 'Weekly groceries',
        date: new Date()
      },
      {
        title: 'Transport',
        total: 8.00,
        paidBy: users[2]._id,
        items: [
          { name: 'Taxi', price: 8.00 }
        ],
        note: 'Taxi fare',
        date: new Date()
      }
    ]);

    console.log('Expenses created:', expenses);

    // Update users' totalSpent and link expenses
    for (const user of users) {
      const userExpenses = expenses.filter(expense => expense.paidBy.equals(user._id));
      user.totalSpent = userExpenses.reduce((total, expense) => total + expense.total, 0);
      await user.save();
    }

    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}
