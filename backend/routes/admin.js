// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET api/admin/visits
// @desc    Get all visits
// @access  Private (admin only)
router.get('/visits', auth, roleCheck(['admin']), adminController.getAllVisits);

// @route   GET api/admin/visits/status/:status
// @desc    Get visits by status
// @access  Private (admin only)
router.get('/visits/status/:status', auth, roleCheck(['admin']), adminController.getVisitsByStatus);

// @route   GET api/admin/visits/today
// @desc    Get visits for today
// @access  Private (admin only)
router.get('/visits/today', auth, roleCheck(['admin']), adminController.getTodayVisits);
// Continuing from the previous code...

// routes/admin.js (continued)
// @route   PUT api/admin/visits/:visitId
// @desc    Approve or reject visit
// @access  Private (admin only)
router.put('/visits/:visitId', auth, roleCheck(['admin']), adminController.updateVisitStatus);

// @route   POST api/admin/preapproval
// @desc    Create a pre-approval
// @access  Private (admin only)
router.post('/preapproval', auth, roleCheck(['admin']), adminController.createPreApproval);

// @route   GET api/admin/preapproval
// @desc    Get all pre-approvals
// @access  Private (admin only)
router.get('/preapproval', auth, roleCheck(['admin']), adminController.getAllPreApprovals);

// @route   PUT api/admin/preapproval/:preApprovalId
// @desc    Update pre-approval status
// @access  Private (admin only)
router.put('/preapproval/:preApprovalId', auth, roleCheck(['admin']), adminController.updatePreApprovalStatus);

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (admin only)
router.get('/users', auth, roleCheck(['admin']), adminController.getAllUsers);

// @route   PUT api/admin/users/:userId/role
// @desc    Update user role
// @access  Private (admin only)
router.put('/users/:userId/role', auth, roleCheck(['admin']), adminController.updateUserRole);

module.exports = router;
