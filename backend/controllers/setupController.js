// controllers/setupController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Initialize the first admin user if no admins exist
exports.initializeAdmin = async (req, res) => {
  try {
    // Check if any admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      return res.status(400).json({ msg: 'Admin already exists in the system' });
    }
    
    const { name, email, password, phone, company } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide name, email and password' });
    }
    
    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'Email already in use' });
    }
    
    // Create the admin user
    const user = new User({
      name,
      email,
      password, // will be hashed by the pre-save hook
      phone,
      company,
      role: 'admin' // Set role to admin
    });
    
    await user.save();
    
    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};