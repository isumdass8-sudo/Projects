const { pool } = require('../config/db');

async function submitContactMessage(req, res, next) {
  try {
    const { name, email, phone, subject, message } = req.body;

    const [result] = await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone || null, subject || null, message]
    );

    res.status(201).json({
      success: true,
      message: 'Thank you — your message has been received. Our team will get back to you shortly.',
      id: result.insertId,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitContactMessage };
