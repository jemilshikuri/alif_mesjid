// models/wednesdayRecord.js
const mongoose = require('mongoose');

const wednesdayRecordSchema = new mongoose.Schema({
  file: {
    type: String, // Path to the file
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const WednesdayRecord = mongoose.model('WednesdayRecord', wednesdayRecordSchema);

module.exports = WednesdayRecord;
