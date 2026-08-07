const { pool } = require('../config/db');

const Favorite = {
  async getByUser(userId) {
    const [rows] = await pool.query(
      `SELECT f.favorite_id, f.created_at, a.*, b.name AS bank_name
       FROM favorites f
       JOIN atms a ON f.atm_id = a.atm_id
       JOIN banks b ON a.bank_id = b.bank_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async add(userId, atmId) {
    await pool.query(
      'INSERT IGNORE INTO favorites (user_id, atm_id) VALUES (?, ?)',
      [userId, atmId]
    );
  },

  async remove(userId, atmId) {
    await pool.query('DELETE FROM favorites WHERE user_id = ? AND atm_id = ?', [userId, atmId]);
  },
};

module.exports = Favorite;
