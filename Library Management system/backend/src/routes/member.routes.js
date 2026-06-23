const express = require('express');
const router = express.Router();
const {
  listMembers, getMember, getMyMemberProfile,
  addMember, editMember, removeMember
} = require('../controllers/member.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

// Logged-in member viewing their own profile
router.get('/me', requireAuth, getMyMemberProfile);

// Librarian/Admin only - manage member profiles
router.get('/', requireAuth, requireRole('librarian', 'super_admin'), listMembers);
router.get('/:id', requireAuth, requireRole('librarian', 'super_admin'), getMember);
router.post('/', requireAuth, requireRole('librarian', 'super_admin'), addMember);
router.put('/:id', requireAuth, requireRole('librarian', 'super_admin'), editMember);
router.delete('/:id', requireAuth, requireRole('librarian', 'super_admin'), removeMember);

module.exports = router;
