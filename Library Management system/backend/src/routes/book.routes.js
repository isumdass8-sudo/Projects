const express = require('express');
const router = express.Router();
const {
  listBooks, getBook, addBook, editBook, removeBook
} = require('../controllers/book.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

// Public routes - anyone can browse/search books
router.get('/', listBooks);
router.get('/:id', getBook);

// Protected routes - only librarians and super_admins can manage books
router.post('/', requireAuth, requireRole('librarian', 'super_admin'), addBook);
router.put('/:id', requireAuth, requireRole('librarian', 'super_admin'), editBook);
router.delete('/:id', requireAuth, requireRole('librarian', 'super_admin'), removeBook);

module.exports = router;
