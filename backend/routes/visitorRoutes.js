const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// Dashboard routes
router.get('/stats', authenticateUser, visitorController.getStats);
router.get('/recent', authenticateUser, visitorController.getRecentVisitors);
router.get('/active', authenticateUser, visitorController.getActiveVisitors);

// Analytics route
router.get('/analytics', authenticateUser, visitorController.getAnalytics);

// Visitor-specific routes
router.get('/my-activities', authenticateUser, visitorController.getVisitorActivities);
router.post('/request-visit', authenticateUser, visitorController.createVisitRequest);
router.get('/pending-requests', authenticateUser, visitorController.getPendingRequests);

module.exports = router; 