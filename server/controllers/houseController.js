const House = require('../models/house');

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
    console.log("fetching all houses for user: " + userId);
    const houses = await House.find({ members: userId }).lean();
    console.log(houses);
    res.status(200).json(houses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching houses', details: error.message });
  }
};

// Controller to get house details by ID
exports.getHouseDetails = async (req, res) => {
  console.log("fetching details for house: ");
  try {
    const { houseId } = req.params;
    console.log(houseId);
    const house = await House.findById(houseId).populate('members', 'name').lean();
    if (!house) {
      return res.status(404).json({ error: 'House not found' });
    }

    res.status(200).json(house);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching house details', details: error.message });
  }
};
