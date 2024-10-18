const House = require('../models/house');
const User = require('../models/user');
// Controller to create a house
exports.createHouse = async (req, res) => {
  try {
    const { name, members } = req.body;

    const newHouse = new House({
      name,
      members
    });

    const savedHouse = await newHouse.save();
    console.log(newHouse);
    res.status(201).json({ message: 'House created successfully', house: savedHouse });
  } catch (error) {
    res.status(500).json({ error: 'Error creating house', details: error.message });
  }
};

// Controller to fetch all houses for a user
exports.fetchHousesByUser = async (req, res) => {
  
  try {
    const { userId } = req.params;
    // console.log("fetching all houses for user: " + userId);
    const houses = await House.find({ members: userId }).lean();
   
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
    const house = await House.findById(houseId).populate('members', 'name').lean();
    if (!house) {
      return res.status(404).json({ error: 'House not found' });
    }

    res.status(200).json(house);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching house details', details: error.message });
  }
};

exports.addHouseMember = async (req, res) => {
  const { email } = req.body; // Extract email from the request body
  const { houseId } = req.params.houseid; // Extract house ID from the request parameters getting undefind idk why
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the user to the house's members list

    const house = await House.findByIdAndUpdate(
      req.params.houseid, // Use the houseId directly
      { $addToSet: { members: user._id } }, // Use $addToSet to avoid duplicates
      { new: true } // Return the updated house
    );

    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    // Return the updated house data
    res.status(200).json({ house });
  } catch (error) {
    console.error("Error details:", error); // Log error details for insights
    res.status(500).json({ message: 'Error adding member', error: error.message }); // Include error message
  }
};
