const express = require('express');
const pool = require('../config/db');
const { emitToAdmins } = require('../utils/socket');

const router = express.Router();

// GET /api/testimonials
router.get('/testimonials', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
  res.json(rows);
});

// GET /api/posts
router.get('/posts', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, title, slug, excerpt, cover_color, published_at FROM posts ORDER BY published_at DESC'
  );
  res.json(rows);
});

// GET /api/posts/:slug
router.get('/posts/:slug', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM posts WHERE slug = ?', [req.params.slug]);
  if (rows.length === 0) return res.status(404).json({ error: 'Post not found.' });
  res.json(rows[0]);
});

// POST /api/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    await pool.query(
      'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, message]
    );
    emitToAdmins('new_contact_message', { name, email, message, created_at: new Date().toISOString() });
    res.status(201).json({ message: 'Thanks — your message has been received. We\'ll be in touch soon.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not send message. Please try again.' });
  }
});

module.exports = router;
