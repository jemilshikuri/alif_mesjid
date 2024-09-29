// models/saturdayRecord.js
const mongoose = require('mongoose');

const saturdayRecordSchema = new mongoose.Schema({
  file: {
    type: String, // Path to the file
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const SaturdayRecord = mongoose.model('SaturdayRecord', saturdayRecordSchema);

module.exports = SaturdayRecord;
