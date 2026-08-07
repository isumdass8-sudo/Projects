const { pool } = require('../config/db');

const Feedback = {
  async getByAtm(atmId) {
    const [rows] = await pool.query(
      `SELECT f.*, u.name AS user_name
       FROM feedback f JOIN users u ON f.user_id = u.user_id
       WHERE f.atm_id = ? ORDER BY f.created_at DESC`,
      [atmId]
    );
    return rows;
  },

  async create({ atm_id, user_id, rating, machine_working, cash_available, parking_available, comment }) {
    const [result] = await pool.query(
      `INSERT INTO feedback
        (atm_id, user_id, rating, machine_working, cash_available, parking_available, comment)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [atm_id, user_id, rating, !!machine_working, !!cash_available, !!parking_available, comment || null]
    );
    return result.insertId;
  },

  async getAverageRating(atmId) {
    const [rows] = await pool.query(
      'SELECT ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS total FROM feedback WHERE atm_id = ?',
      [atmId]
    );
    return rows[0];
  },
};

module.exports = Feedback;
