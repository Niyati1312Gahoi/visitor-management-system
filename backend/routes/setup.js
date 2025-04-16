// routes/setup.js
const express = require('express');
const router = express.Router();
const setupController = require('../controllers/setupController');

// @route   POST api/setup/admin
// @desc    Initialize first admin user (only works if no admin exists)
// @access  Public
router.post('/admin', setupController.initializeAdmin);

module.exports = router;