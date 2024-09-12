const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();  // Add this at the top of your main server file (app.js, server.js, etc.)

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'user-profile',
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });

  module.exports = {
    cloudinary,
    storage
  }
