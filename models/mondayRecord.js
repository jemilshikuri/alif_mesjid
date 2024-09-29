// models/mondayRecord.js
const mongoose = require('mongoose');

const mondayRecordSchema = new mongoose.Schema({
  file: {
    type: String, // Path to the file
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const MondayRecord = mongoose.model('MondayRecord', mondayRecordSchema);

module.exports = MondayRecord;
