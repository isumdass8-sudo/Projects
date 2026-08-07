const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM districts ORDER BY name');
  res.json(rows);
});

module.exports = router;
