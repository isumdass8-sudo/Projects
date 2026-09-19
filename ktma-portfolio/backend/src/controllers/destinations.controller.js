const { pool } = require('../config/db');

async function getAllDestinations(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM destinations ORDER BY display_order ASC, id ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getDestinationById(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM destinations WHERE id = ?', [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllDestinations, getDestinationById };
