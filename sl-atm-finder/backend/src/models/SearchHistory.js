const { pool } = require('../config/db');

const SearchHistory = {
  async record(userId, atmId) {
    await pool.query('INSERT INTO search_history (user_id, atm_id) VALUES (?, ?)', [
      userId,
      atmId,
    ]);
  },

  async getRecent(userId, limit = 10) {
    const [rows] = await pool.query(
      `SELECT DISTINCT a.*, b.name AS bank_name, MAX(sh.viewed_at) AS last_viewed
       FROM search_history sh
       JOIN atms a ON sh.atm_id = a.atm_id
       JOIN banks b ON a.bank_id = b.bank_id
       WHERE sh.user_id = ?
       GROUP BY a.atm_id
       ORDER BY last_viewed DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  },
};

module.exports = SearchHistory;
