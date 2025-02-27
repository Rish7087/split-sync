
const User = require("../models/user");

// 🔹 Signup User
const signupUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ username, password });
        await newUser.save();
        res.json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 🔹 Login User
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Store session
        req.session.user = { _id: user._id, name: user.username };
        res.json({ message: "Login successful", user: req.session.user });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { signupUser, loginUser };
