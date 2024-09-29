// models/thursdayRecord.js
const mongoose = require('mongoose');

const thursdayRecordSchema = new mongoose.Schema({
  file: {
    type: String, // Path to the file
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const ThursdayRecord = mongoose.model('ThursdayRecord', thursdayRecordSchema);

module.exports = ThursdayRecord;
