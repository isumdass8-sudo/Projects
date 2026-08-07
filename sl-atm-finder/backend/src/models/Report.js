const { pool } = require('../config/db');

const Report = {
  async getAll(status) {
    const params = [];
    let where = '';
    if (status) {
      where = 'WHERE r.status = ?';
      params.push(status);
    }
    const [rows] = await pool.query(
      `SELECT r.*, a.name AS atm_name, a.city
       FROM reports r JOIN atms a ON r.atm_id = a.atm_id
       ${where} ORDER BY r.created_at DESC`,
      params
    );
    return rows;
  },

  async create({ atm_id, user_id, problem }) {
    const [result] = await pool.query(
      'INSERT INTO reports (atm_id, user_id, problem) VALUES (?, ?, ?)',
      [atm_id, user_id || null, problem]
    );
    // Mark ATM as reported so it surfaces in filters/alerts
    await pool.query("UPDATE atms SET status = 'reported' WHERE atm_id = ?", [atm_id]);
    return result.insertId;
  },

  async updateStatus(reportId, status) {
    const resolvedAt = status === 'resolved' ? new Date() : null;
    await pool.query('UPDATE reports SET status = ?, resolved_at = ? WHERE report_id = ?', [
      status,
      resolvedAt,
      reportId,
    ]);
  },
};

module.exports = Report;
