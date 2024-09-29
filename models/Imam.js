const mongoose = require('mongoose');

const ImamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  twitter: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  linkedin: { type: String },
  tiktok: { type: String },
  youtube: { type: String },
  whatsapp: { type: String }
});

module.exports = mongoose.model('Imam', ImamSchema);


