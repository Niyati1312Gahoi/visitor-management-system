// controllers/photoController.js
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Upload visitor photo
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    
    // Update user with photo URL
    const user = await User.findById(req.user.id);
    
    // Delete old photo if exists
    if (user.photoUrl) {
      const oldPhotoPath = path.join(__dirname, '..', user.photoUrl.replace(/^\//, ''));
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    
    // Update with new photo URL
    const photoUrl = `/uploads/photos/${req.file.filename}`;
    user.photoUrl = photoUrl;
    await user.save();
    
    res.json({ photoUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get visitor photo
exports.getPhoto = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.findById(userId).select('photoUrl');
    
    if (!user || !user.photoUrl) {
      return res.status(404).json({ msg: 'Photo not found' });
    }
    
    const photoPath = path.join(__dirname, '..', user.photoUrl.replace(/^\//, ''));
    
    if (!fs.existsSync(photoPath)) {
      return res.status(404).json({ msg: 'Photo file not found' });
    }
    
    res.sendFile(photoPath);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};