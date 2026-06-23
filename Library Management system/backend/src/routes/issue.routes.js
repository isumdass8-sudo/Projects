const express = require('express');
const router = express.Router();
const { listIssues, getMyIssues, createIssue, processReturn } = require('../controllers/issue.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

// Logged-in member - view their own borrowing history
router.get('/me', requireAuth, getMyIssues);

// Librarian/Admin only
router.get('/', requireAuth, requireRole('librarian', 'super_admin'), listIssues);
router.post('/', requireAuth, requireRole('librarian', 'super_admin'), createIssue);
router.put('/:id/return', requireAuth, requireRole('librarian', 'super_admin'), processReturn);

module.exports = router;
