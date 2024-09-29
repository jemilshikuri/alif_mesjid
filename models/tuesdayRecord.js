// models/tuesdayRecord.js
const mongoose = require('mongoose');

const tuesdayRecordSchema = new mongoose.Schema({
  file: {
    type: String, // Path to the file
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const TuesdayRecord = mongoose.model('TuesdayRecord', tuesdayRecordSchema);

module.exports = TuesdayRecord;
