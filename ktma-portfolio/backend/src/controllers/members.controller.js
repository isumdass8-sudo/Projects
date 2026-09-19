const { pool } = require('../config/db');

async function getCommittee(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM committee_members ORDER BY display_order ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getBusinessMembers(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM business_members ORDER BY featured DESC, business_name ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = { getCommittee, getBusinessMembers };
