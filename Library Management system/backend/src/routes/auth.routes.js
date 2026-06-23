const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route - requires a valid JWT
router.get('/me', requireAuth, getProfile);

module.exports = router;
