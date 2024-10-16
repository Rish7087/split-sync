const Room = require('../models/room');

// Controller to create a room in a house
exports.createRoom = async (req, res) => {
  try {
    const { name, houseId, members } = req.body;

    const newRoom = new Room({
      name,
      houseId,
      members
    });

    const savedRoom = await newRoom.save();
    res.status(201).json({ message: 'Room created successfully', room: savedRoom });
  } catch (error) {
    res.status(500).json({ error: 'Error creating room', details: error.message });
  }
};

// Controller to fetch all rooms for a house
exports.fetchRoomsByHouse = async (req, res) => {
  try {
    const { houseId } = req.params;

    const rooms = await Room.find({ houseId }).populate('members', 'name').lean();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching rooms', details: error.message });
  }
};

// Controller to get room details by ID
exports.getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId).populate('members', 'name').lean();
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching room details', details: error.message });
  }
};
