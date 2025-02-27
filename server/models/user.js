const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // Storing plain text password
    profilePic: { type: String, required: false }, // URL to the user's profile picture
});

module.exports = mongoose.model("User", UserSchema);
