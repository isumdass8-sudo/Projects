const { pool } = require('../config/db');

// Get all members, joined with their user info (name, email)
async function getAllMembers() {
  const [rows] = await pool.query(
    `SELECT members.*, users.name, users.email, users.status AS account_status
     FROM members
     JOIN users ON members.user_id = users.id
     ORDER BY members.id DESC`
  );
  return rows;
}

// Get a single member by their member id
async function getMemberById(id) {
  const [rows] = await pool.query(
    `SELECT members.*, users.name, users.email, users.status AS account_status
     FROM members
     JOIN users ON members.user_id = users.id
     WHERE members.id = ?`,
    [id]
  );
  return rows[0];
}

// Get a member profile by user id (useful for "my profile" type pages)
async function getMemberByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT members.*, users.name, users.email, users.status AS account_status
     FROM members
     JOIN users ON members.user_id = users.id
     WHERE members.user_id = ?`,
    [userId]
  );
  return rows[0];
}

// Create a member profile for an existing user account
async function createMember({ user_id, student_id, department, membership_type, expiry_date }) {
  const [result] = await pool.query(
    `INSERT INTO members (user_id, student_id, department, membership_type, expiry_date)
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, student_id || null, department || null, membership_type || 'standard', expiry_date || null]
  );
  return result.insertId;
}

// Update a member profile
async function updateMember(id, { student_id, department, membership_type, expiry_date, status }) {
  const [result] = await pool.query(
    `UPDATE members SET
       student_id = ?, department = ?, membership_type = ?, expiry_date = ?, status = ?
     WHERE id = ?`,
    [student_id || null, department || null, membership_type, expiry_date || null, status, id]
  );
  return result.affectedRows > 0;
}

// Delete a member profile
async function deleteMember(id) {
  const [result] = await pool.query('DELETE FROM members WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllMembers, getMemberById, getMemberByUserId,
  createMember, updateMember, deleteMember
};
