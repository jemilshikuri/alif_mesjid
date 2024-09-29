// models/Announcement.js



const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  image: { type: String, required: true }, // URL or path to the image
  createdAt: { type: Date, default: Date.now } // Automatically set to current date and time
});

module.exports = mongoose.model('Announcement', announcementSchema);


