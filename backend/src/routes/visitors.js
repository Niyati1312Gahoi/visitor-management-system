const express = require('express');
const { check } = require('express-validator');
const {
  registerVisitor,
  getVisitors,
  getVisitor,
  updateVisitorStatus,
  checkInVisitor,
  checkOutVisitor
} = require('../controllers/visitors');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const visitorValidation = [
  check('fullName', 'Full name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('company', 'Company name is required').not().isEmpty(),
  check('purpose', 'Purpose of visit is required').not().isEmpty(),
  check('hostEmployee', 'Host employee is required').not().isEmpty(),
  check('photo', 'Photo is required').not().isEmpty()
];

// All routes are protected
router.use(protect);

// Routes
router.post('/', authorize('admin', 'receptionist'), visitorValidation, registerVisitor);
router.get('/', authorize('admin', 'receptionist', 'guard'), getVisitors);
router.get('/:id', authorize('admin', 'receptionist', 'guard'), getVisitor);
router.put('/:id/status', authorize('admin', 'receptionist'), updateVisitorStatus);
router.put('/:id/checkin', authorize('admin', 'receptionist', 'guard'), checkInVisitor);
router.put('/:id/checkout', authorize('admin', 'receptionist', 'guard'), checkOutVisitor);

module.exports = router; 