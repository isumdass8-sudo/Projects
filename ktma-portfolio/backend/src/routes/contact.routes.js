const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { submitContactMessage } = require('../controllers/contact.controller');
const validateContact = require('../middleware/validateContact');

// Basic abuse protection on the public inquiry form.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many messages sent. Please try again later.' },
});

router.post('/', contactLimiter, validateContact, submitContactMessage);

module.exports = router;
