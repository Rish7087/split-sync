const House = require('../models/house');
const User = require('../models/user');
const ExpenseList = require('../models/expenseList');


//fetch expense lists
exports.fetchExpenseLists = async (req, res) => {
  try {
    const { houseId } = req.params;
    const expenseLists = await ExpenseList.find({ houseId }).select("_id title"); // Fetch ID and Title
    res.json(expenseLists);
  } catch (error) {
    res.status(500).json({ error: "Error fetching expense lists", details: error.message });
  }
};

// Controller to create a house
exports.createHouse = async (req, res) => {
  const { name, userId } = req.body;
  console.log('UserID received in backend:', userId);

  try {
    // Step 1: Create and save the house to get the `houseId`
    const newHouse = new House({
      name,
      members: [userId], // Add the creator as the first member
      admin: userId,     // Set the user as the admin
      expenseLists: []   // Initialize with an empty expense list
    });
    console.log(newHouse);
    await newHouse.save(); // Now, `newHouse._id` is available

    // Step 2: Create the expense list using the saved house's ID
    const newExpenseList = new ExpenseList({
      houseId: newHouse._id,  // Use the saved house's ID
      title: 'expenselist1',
      startDate: Date.now(),
    });
    await newExpenseList.save();

    // Step 3: Attach the expense list to the house and save it
    newHouse.expenseLists.push(newExpenseList._id);
    await newHouse.save(); // Save the updated house with the expense list

    res.status(201).json({ house: newHouse });
  } catch (error) {
    console.error('Error creating house:', error);
    res.status(500).json({ message: 'Error creating house', error: error.message });
  }
};

// Controller to fetch all houses for a user
exports.fetchHousesByUser = async (req, res) => {
  
  try {
    const { userId } = req.params;
    // console.log("fetching all houses for user: " + userId);
    const houses = await House.find({ members: userId }, 'name members admin').lean();

    res.status(200).json(houses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching houses', details: error.message });
  }
};

// Controller to get house details by ID
exports.getHouseDetails = async (req, res) => {
  // console.log("fetching details for house: ");
  try {
    const { houseId } = req.params;
    // console.log(houseId);
    const house = await House.findById(houseId)
    .populate('members', 'username totalPaid owes owned profilePic')
    .lean();
  
    if (!house) {
      return res.status(404).json({ error: 'House not found' });
    }

    res.status(200).json(house);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching house details', details: error.message });
  }
};
// In your addHouseMember controller
exports.addHouseMember = async (req, res) => {
  const { houseId, name, userId } = req.body;
  console.log("Adding member with username:", name);
  console.log("House ID:", houseId);
  console.log("Current admin user ID:", userId);
  try {
    // Find the house and check if the current user is the admin
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }
    console.log('Admin ID:', house.admin.toString());
    console.log('User ID:', userId);
    if (house.admin.toString() !== userId) {
      return res.status(403).json({ message: 'Only the admin can add members' });
    }

    // Look for the user by username
    const user = await User.findOne({ username: name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already a member
    if (house.members.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a member of the house' });
    }

    house.members.addToSet(user._id); // Ensure no duplicate members
    await house.save();

    res.status(200).json({ message: 'Member added successfully', house });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Error adding member', error: error.message });
  }
};

exports.clearBalance = async (req, res) => {
  const { houseId } = req.params;
  const { title } = req.body; 
  try {
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ error: 'House not found' });
    }

    // Mark all current expense lists as cleared
    house.expenseLists.forEach(expenseList => {
      expenseList.endDate = new Date(); // Mark the current list as cleared
    });

    // Create a new expense list
    const newExpenseList = new ExpenseList({
      houseId: house._id,
      title: title,
      startDate: Date.now(),
    });
    await newExpenseList.save();

    // Attach the new expense list to the house
    house.expenseLists.push(newExpenseList._id);
    await house.save();

    res.status(201).json({ message: 'Balances cleared and new expense list created successfully' });
  } catch (error) {
    console.error('Error clearing balances:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
