// initDB.js
const mongoose = require('mongoose');
const User = require('./models/user');
const Expense = require('./models/expenses');

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

    // Create new users
    const users = await User.insertMany([
      { name: 'Rishabh', pin: '0001' },
      { name: 'Utkarsh', pin: '0002' },
      { name: 'Krishna', pin: '0003' },
      { name: 'Lakshay', pin: '0004' }
    ]);

    console.log('Users created:', users);

    // Create new expenses
    const expenses = await Expense.insertMany([
        { title: 'Dinner', item: 'Pizza', total: 20.00, paidBy: users[0]._id },
        { title: 'Groceries', item: 'Milk, Bread', total: 15.50, paidBy: users[1]._id },
        { title: 'Transport', item: 'Taxi', total: 8.00, paidBy: users[2]._id }
      ]);
      

    console.log('Expenses created:', expenses);

    // Assign expenses to users
    users[0].expenses.push(expenses[0]._id);
    users[1].expenses.push(expenses[1]._id);
    users[2].expenses.push(expenses[2]._id);

    // Update the totalSpent for each user
    users[0].totalSpent = expenses[0].price;
    users[1].totalSpent = expenses[1].price;
    users[2].totalSpent = expenses[2].price;

    // Save the users with updated expenses and totalSpent
    await users[0].save();
    await users[1].save();
    await users[2].save();

    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}
