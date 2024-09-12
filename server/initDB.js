const mongoose = require('mongoose');
const User = require('./models/user'); // Ensure this model matches your schema

async function seedDatabase() {
  await mongoose.connect("mongodb+srv://rishabhsaini40618:Mxy%407087@cluster0.uhyzl.mongodb.net/split-buddies?retryWrites=true&w=majority&appName=Cluster0");

  const users = [
    { name: "Rishabh", pin: "0001", profilePic: "../assets/user1.jpeg", totalSpent: 20 },
    { name: "Utkarsh", pin: "0002", profilePic: "../assets/user2.jpeg", totalSpent: 15.5 },
    { name: "Krishna", pin: "0003", profilePic: "../assets/user3.jpeg", totalSpent: 8 },
    { name: "Lakshay", pin: "0004", profilePic: "../assets/user4.jpeg", totalSpent: 0 }
  ];

  await User.insertMany(users);
  console.log('Data inserted successfully');
  mongoose.connection.close();
}

seedDatabase();
