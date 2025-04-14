const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await User.find().select('-password');
    res.json({ data: employees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 