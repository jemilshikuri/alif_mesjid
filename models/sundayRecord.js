// models/sundayRecord.js
const mongoose = require('mongoose');

const sundayRecordSchema = new mongoose.Schema({
  file: {
    type: String, // Path to the file
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const SundayRecord = mongoose.model('SundayRecord', sundayRecordSchema);

module.exports = SundayRecord;
