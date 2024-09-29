// routes/announcements.js

const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const upload = require('../config/announcementMulterConfig');


const path = require('path');
const { isAuthenticated } = require('../middlewares/auth');


// Get all announcements
router.get('/',  async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.render('announcements', { announcements });
  } catch (err) {
    res.status(500).send('Error fetching announcements');
  }
});

// Render new announcement form
router.get('/new', (req, res) => {
  res.render('newAnnouncement');
});




// Handle new announcement submission
router.post('/',  upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No image uploaded');
    }

    const relativeImagePath = path.join('uploads', 'announcements', req.file.filename);
    const newAnnouncement = new Announcement({ image: relativeImagePath });
    await newAnnouncement.save();
    res.redirect('/announcements');
  } catch (err) {
    res.status(500).send('Error adding announcement');
  }
});

// Render edit announcement form
router.get('/edit/:id',  async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).send('Announcement not found');
    res.render('editAnnouncement', { announcement });
  } catch (err) {
    res.status(500).send('Error fetching announcement');
  }
});

// Handle edit announcement submission
router.post('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {};
    if (req.file) {
      const relativeImagePath = path.join('uploads', 'announcements', req.file.filename);
      updateData.image = relativeImagePath;
    }

    await Announcement.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.redirect('/announcements');
  } catch (err) {
    res.status(500).send('Error updating announcement');
  }
});

// Handle delete announcement
router.post('/delete/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
      // Delete the file from the filesystem
      const filePath = path.join(process.cwd(), announcement.image);
      const fs = require('fs');

      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
          return res.status(500).send('Internal Server Error');
        }

        // If file deletion is successful, delete the announcement record from the database
        await Announcement.findByIdAndDelete(req.params.id);
        res.redirect('/announcements');
      });
    } else {
      res.status(404).send('Announcement not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting announcement');
  }
});


module.exports = router;



  
  










