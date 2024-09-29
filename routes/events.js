//routes/events.js

const express = require('express');
const Event = require('../models/Event');
const router = express.Router();
const upload = require('../config/eventMulterConfig');
const path = require('path');
const { isAuthenticated } = require('../middlewares/auth');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.render('events', { events });
  } catch (err) {
    res.status(500).send('Error fetching events');
  }
});

// Render new event form
router.get('/new', (req, res) => {
  res.render('newEvent');
});

// Handle new event submission
router.post('/',upload.single('imageOfBook'), async (req, res) => {
  try {
    const { bookTitle, teacher, description, dateAndDuration,day } = req.body;
    const imageOfBook = req.file ? path.join('uploads', 'events', req.file.filename) : '';
    const newEvent = new Event({ bookTitle, teacher, description, dateAndDuration, imageOfBook ,day});
    await newEvent.save();
    res.redirect('/events');
  } catch (err) {
    res.status(500).send('Error adding event');
  }
});

// Render edit event form
router.get('/edit/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).send('Event not found');
    res.render('editEvent', { event });
  } catch (err) {
    res.status(500).send('Error fetching event');
  }
});

// Handle edit event submission
router.post('/edit/:id', upload.single('imageOfBook'), async (req, res) => {
  try {
    const { bookTitle, teacher, description, dateAndDuration,day } = req.body;
    const updateData = { bookTitle, teacher, description, dateAndDuration,day };
    if (req.file) {
      updateData.imageOfBook = path.join('uploads', 'events', req.file.filename);
    }
    await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.redirect('/events');
  } catch (err) {
    res.status(500).send('Error updating event');
  }
});

// Handle delete event
router.post('/delete/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      // Delete the image file from the filesystem
      const imagePath = path.join(process.cwd(), event.imageOfBook);
      const fs = require('fs');

      fs.unlink(imagePath, async (err) => {
        if (err) {
          console.error(`Failed to delete image: ${imagePath}`, err);
          return res.status(500).send('Internal Server Error');
        }

        // If image deletion is successful, delete the event record from the database
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/events');
      });
    } else {
      res.status(404).send('Event not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting event');
  }
});


module.exports = router;

