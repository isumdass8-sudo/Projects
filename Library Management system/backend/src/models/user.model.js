const { pool } = require('../config/db');

// Find a user by email (used during login and registration checks)
async function findUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0]; // returns undefined if not found
}

// Find a user by id (used to get profile info from a JWT token)
async function findUserById(id) {
  const [rows] = await pool.query(
    `SELECT users.id, users.name, users.email, users.status,
            roles.name AS role
     FROM users
     JOIN roles ON users.role_id = roles.id
     WHERE users.id = ?`,
    [id]
  );
  return rows[0];
}

// Create a new user. role_id defaults to 3 (member) if not provided.
async function createUser({ name, email, passwordHash, roleId = 3 }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, roleId]
  );
  return result.insertId; // the new user's id
}

module.exports = { findUserByEmail, findUserById, createUser };
