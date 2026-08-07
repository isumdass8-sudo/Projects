const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const reportController = require('../controllers/reportController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireAdmin);

router.get('/stats', statsController.getDashboardStats);
router.get('/reports', reportController.getReports);
router.put('/reports/:id', reportController.updateReportStatus);

module.exports = router;
