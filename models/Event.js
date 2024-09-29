//models/Event.js


const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  bookTitle: { type: String, required: true },
  teacher: { type: String, required: true },
  description: { type: String, required: true },
  dateAndDuration: { type: String, required: true },
  day: { type: String, required: true },
  imageOfBook: { type: String, required: true }, // URL or path to the image of the book
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);



