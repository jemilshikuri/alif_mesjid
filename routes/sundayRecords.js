const express = require('express');
const router = express.Router();
const upload = require('../config/recordConfigMulter');
const SundayRecord = require('../models/sundayRecord');
const path = require('path');

// Read
router.get('/', async (req, res) => {
  try {
    const records = await SundayRecord.find();
    res.render('sundayRecords', { records });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Create
router.get('/new', (req, res) => {
  res.render('newSundayRecords'); // Render the form for creating a new record
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const relativeFilePath = path.relative(process.cwd(), req.file.path);
    const newRecord = new SundayRecord({
      file: relativeFilePath,
      description: req.body.description
    });
    await newRecord.save();
    res.redirect('/sunday/records');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update
router.get('/edit/:id', async (req, res) => {
  try {
    const record = await SundayRecord.findById(req.params.id);
    res.render('editSundayRecords', { record });
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
    const updatedRecord = await SundayRecord.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.redirect('/sunday/records');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete
router.post('/delete/:id', async (req, res) => {
  try {
    const record = await SundayRecord.findById(req.params.id);

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
        await SundayRecord.findByIdAndDelete(req.params.id);
        res.redirect('/sunday/records');
      });
    } else {
      res.status(404).send('Record not found');
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});


module.exports = router;
