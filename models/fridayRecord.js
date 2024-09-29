// models/fridayRecord.js
const mongoose = require('mongoose');

const fridayRecordSchema = new mongoose.Schema({
  file: {
    type: String, // Path to the file
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const FridayRecord = mongoose.model('FridayRecord', fridayRecordSchema);

module.exports = FridayRecord;
