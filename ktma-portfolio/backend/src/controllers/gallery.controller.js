const { pool } = require('../config/db');

async function getGallery(req, res, next) {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM gallery';
    const params = [];
    if (category && category !== 'All') {
      sql += ' WHERE category = ?';
      params.push(category);
    }
    sql += ' ORDER BY display_order ASC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { getGallery };
