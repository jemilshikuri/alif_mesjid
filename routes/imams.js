const express = require('express');
const router = express.Router();
const Imam = require('../models/Imam');
const upload = require('../config/imamConfig');
const path = require('path'); 

// Get all imams
router.get('/', async (req, res) => {
  try {
    const imams = await Imam.find();
    res.render('imams', { imams });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get form to create a new imam
router.get('/new', (req, res) => {
  res.render('newImams');
});

// Create a new imam
router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.render('newImams', { msg: err });
    } else {
      const { name, title, description, twitter, facebook, instagram, linkedin, tiktok, youtube, whatsapp } = req.body;
      const image = req.file ? `uploads/imams/${req.file.filename}` : '';

      try {
        const newImam = new Imam({ name, title, description, image, twitter, facebook, instagram, linkedin, tiktok, youtube, whatsapp });
        await newImam.save();
        res.redirect('/imams');
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    }
  });
});

// Get form to edit an imam
router.get('/edit/:id', async (req, res) => {
  try {
    const imam = await Imam.findById(req.params.id);
    res.render('editImams', { imam });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update an imam
router.post('/edit/:id', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.render('editImams', { msg: err });
    } else {
      const { name, title, description, twitter, facebook, instagram, linkedin, tiktok, youtube, whatsapp } = req.body;
      const image = req.file ? `uploads/imams/${req.file.filename}` : req.body.currentImage;

      try {
        await Imam.findByIdAndUpdate(req.params.id, { name, title, description, image, twitter, facebook, instagram, linkedin, tiktok, youtube, whatsapp });
        res.redirect('/imams');
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    }
  });
});

// Delete an imam
router.post('/delete/:id', async (req, res) => {
  try {
    const imam = await Imam.findById(req.params.id);

    if (imam) {
      // Delete the image file from the filesystem
      const imagePath = path.join(process.cwd(), imam.image);
      const fs = require('fs');

      fs.unlink(imagePath, async (err) => {
        if (err) {
          console.error(`Failed to delete image: ${imagePath}`, err);
          return res.status(500).send('Internal Server Error');
        }

        // If image deletion is successful, delete the imam record from the database
        await Imam.findByIdAndDelete(req.params.id);
        res.redirect('/imams');
      });
    } else {
      res.status(404).send('Imam not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
