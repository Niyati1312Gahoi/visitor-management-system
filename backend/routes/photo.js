// routes/photo.js
const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const roleCheck = require('../middleware/roleCheck');

// @route   POST api/photo/upload
// @desc    Upload visitor photo
// @access  Private (visitor only)
router.post(
  '/upload', 
  auth, 
  roleCheck(['visitor']), 
  upload.single('photo'), 
  photoController.uploadPhoto
);

// @route   GET api/photo/:userId
// @desc    Get visitor photo
// @access  Private (admin or self)
router.get('/:userId', auth, photoController.getPhoto);

module.exports = router;