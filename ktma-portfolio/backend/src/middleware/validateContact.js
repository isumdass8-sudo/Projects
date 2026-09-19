const { body, validationResult } = require('express-validator');

const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 40 }),
  body('subject').optional({ checkFalsy: true }).trim().isLength({ max: 150 }),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 3000 })
    .withMessage('Message is too long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
    }
    next();
  },
];

module.exports = validateContact;
