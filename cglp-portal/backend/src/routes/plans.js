const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /api/plans
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM plans ORDER BY sort_order ASC');
  res.json(rows);
});

// GET /api/plans/:code
router.get('/:code', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM plans WHERE code = ?', [req.params.code]);
  if (rows.length === 0) return res.status(404).json({ error: 'Plan not found.' });
  res.json(rows[0]);
});

module.exports = router;
