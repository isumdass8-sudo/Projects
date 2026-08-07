const { pool } = require('../config/db');

const Bank = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM banks ORDER BY name');
    return rows;
  },

  async getById(bankId) {
    const [rows] = await pool.query('SELECT * FROM banks WHERE bank_id = ?', [bankId]);
    return rows[0] || null;
  },

  async search(query) {
    const [rows] = await pool.query(
      'SELECT * FROM banks WHERE name LIKE ? OR short_name LIKE ? ORDER BY name',
      [`%${query}%`, `%${query}%`]
    );
    return rows;
  },

  async create({ name, short_name, logo_url, website, contact }) {
    const [result] = await pool.query(
      'INSERT INTO banks (name, short_name, logo_url, website, contact) VALUES (?, ?, ?, ?, ?)',
      [name, short_name, logo_url, website, contact]
    );
    return this.getById(result.insertId);
  },

  async update(bankId, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return this.getById(bankId);
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = keys.map((k) => fields[k]);
    await pool.query(`UPDATE banks SET ${setClause} WHERE bank_id = ?`, [...values, bankId]);
    return this.getById(bankId);
  },

  async remove(bankId) {
    await pool.query('DELETE FROM banks WHERE bank_id = ?', [bankId]);
  },
};

module.exports = Bank;
