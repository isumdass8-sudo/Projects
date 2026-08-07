const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(userId) {
    const [rows] = await pool.query(
      'SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?',
      [userId]
    );
    return rows[0] || null;
  },

  async create({ name, email, password, role = 'user' }) {
    const existing = await this.findByEmail(email);
    if (existing) throw new Error('Email already registered');

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );
    return this.findById(result.insertId);
  },

  async verifyPassword(plainPassword, passwordHash) {
    return bcrypt.compare(plainPassword, passwordHash);
  },
};

module.exports = User;
