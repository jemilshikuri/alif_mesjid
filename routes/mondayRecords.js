const express = require('express');
const router = express.Router();
const upload = require('../config/recordConfigMulter');
const MondayRecord = require('../models/mondayRecord');
const path = require('path');

// Read
router.get('/', async (req, res) => {
  try {
    const records = await MondayRecord.find();
    res.render('mondayRecords', { records });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create
router.get('/new', (req, res) => {
  res.render('newMondayRecords'); // Render the form for creating a new record
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const relativeFilePath = path.relative(process.cwd(), req.file.path);
    const newRecord = new MondayRecord({
      file: relativeFilePath,
      description: req.body.description
    });
    await newRecord.save();
    res.redirect('/monday/records');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update
router.get('/edit/:id', async (req, res) => {
  try {
    const record = await MondayRecord.findById(req.params.id);
    res.render('editMondayRecords', { record });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/edit/:id', upload.single('file'), async (req, res) => {
  try {
    const updatedData = {
      description: req.body.description
    };
    if (req.file) {
      updatedData.file = path.relative(process.cwd(), req.file.path);
    }
    const updatedRecord = await MondayRecord.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.redirect('/monday/records');
  } catch (err) {
    res.status(400).send(err.message);
  }
});


// Delete
router.post('/delete/:id', async (req, res) => {
  try {
    const record = await MondayRecord.findById(req.params.id);

    if (record) {
      // Delete the file from the filesystem
      const filePath = path.join(process.cwd(), record.file);
      const fs = require('fs');

      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
          return res.status(500).send('Internal Server Error');
        }

        // If file deletion is successful, delete the record from the database
        await MondayRecord.findByIdAndDelete(req.params.id);
        res.redirect('/monday/records');
      });
    } else {
      res.status(404).send('Record not found');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});


module.exports = router;

