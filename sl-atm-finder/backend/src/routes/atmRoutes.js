const express = require('express');
const router = express.Router();
const atmController = require('../controllers/atmController');
const feedbackController = require('../controllers/feedbackController');
const reportController = require('../controllers/reportController');
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');

// Public search & lookup endpoints
router.get('/', atmController.getAllATMs);
router.get('/search', atmController.searchATMs);
router.get('/nearest', atmController.nearestATMs);
router.get('/emergency', atmController.emergencyNearest);
router.get('/route', atmController.routeATMs);
router.get('/:id', optionalAuth, atmController.getATM);

// Feedback & reports for a specific ATM
router.get('/:atmId/feedback', feedbackController.getFeedbackForAtm);
router.post('/:atmId/feedback', authenticate, feedbackController.submitFeedback);
router.post('/:atmId/report', optionalAuth, reportController.submitReport);

// Admin-only management
router.post('/', authenticate, requireAdmin, atmController.createATM);
router.post('/bulk', authenticate, requireAdmin, atmController.bulkCreateATMs);
router.put('/:id', authenticate, requireAdmin, atmController.updateATM);
router.delete('/:id', authenticate, requireAdmin, atmController.deleteATM);

module.exports = router;
