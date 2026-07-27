const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET /api/lands — public, powers the interactive plantation map
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM lands ORDER BY id');
  res.json(rows);
});

module.exports = router;
