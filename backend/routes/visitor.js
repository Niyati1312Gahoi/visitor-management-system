// routes/visitor.js
const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   POST api/visitor/visit
// @desc    Create a new visit request
// @access  Private (visitor only)
router.post('/visit', auth, roleCheck(['visitor']), visitorController.createVisit);

// @route   GET api/visitor/visits
// @desc    Get all visits for current visitor
// @access  Private (visitor only)
router.get('/visits', auth, roleCheck(['visitor']), visitorController.getMyVisits);

// @route   POST api/visitor/checkin
// @desc    Check-in visitor using QR/passcode
// @access  Private (visitor only)
router.post('/checkin', auth, roleCheck(['visitor']), visitorController.checkIn);

// @route   PUT api/visitor/checkout/:visitId
// @desc    Check-out visitor
// @access  Private (visitor only)
router.put('/checkout/:visitId', auth, roleCheck(['visitor']), visitorController.checkOut);

module.exports = router;