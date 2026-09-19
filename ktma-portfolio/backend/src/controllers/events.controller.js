const { pool } = require('../config/db');

async function getAllEvents(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM events ORDER BY event_date DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getEventById(req, res, next) {
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const [gallery] = await pool.query(
      'SELECT * FROM gallery WHERE event_id = ? ORDER BY display_order ASC',
      [req.params.id]
    );
    res.json({ ...rows[0], gallery });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllEvents, getEventById };
