const express = require('express');
const pool = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');
const { summarize } = require('../utils/payoutEngine');

const router = express.Router();
router.use(requireAuth, requireRole('admin', 'staff'));

// GET /api/admin/analytics
router.get('/analytics', async (req, res) => {
  const [[userCount]] = await pool.query(
    "SELECT COUNT(*) AS count FROM users WHERE role = 'customer'"
  );
  const [[contribAgg]] = await pool.query(
    'SELECT COUNT(*) AS count, COALESCE(SUM(amount),0) AS total FROM contributions'
  );
  const [byPlan] = await pool.query(
    `SELECT p.name AS plan_name, COUNT(c.id) AS contributions, COALESCE(SUM(c.amount),0) AS total
     FROM plans p LEFT JOIN contributions c ON c.plan_id = p.id
     GROUP BY p.id, p.name ORDER BY p.sort_order`
  );
  const [signupsByMonth] = await pool.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
     FROM users WHERE role = 'customer'
     GROUP BY month ORDER BY month`
  );
  const [allContributions] = await pool.query('SELECT * FROM contributions');
  const totalIncomePaid = allContributions.reduce(
    (sum, c) => sum + summarize(c).totalPaidOut,
    0
  );

  res.json({
    totalCustomers: userCount.count,
    totalContributions: contribAgg.count,
    totalContributed: Number(contribAgg.total),
    totalIncomePaid: Number(totalIncomePaid.toFixed(2)),
    byPlan: byPlan.map((r) => ({ ...r, total: Number(r.total) })),
    signupsByMonth
  });
});

// GET /api/admin/contributions — every contribution, across all customers
router.get('/contributions', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, u.full_name, u.email, p.name AS plan_name
     FROM contributions c
     JOIN users u ON u.id = c.user_id
     JOIN plans p ON p.id = c.plan_id
     ORDER BY c.created_at DESC`
  );
  res.json(rows.map((c) => ({ ...c, amount: Number(c.amount) })));
});

// GET /api/admin/messages — contact form submissions
router.get('/messages', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
  res.json(rows);
});

// GET /api/admin/users — admin only (staff can't manage roles)
router.get('/users', requireRole('admin'), async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
  );
  res.json(rows);
});

// PATCH /api/admin/users/:id/role  { role: 'customer'|'staff'|'admin' }  — admin only
router.patch('/users/:id/role', requireRole('admin'), async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'staff', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }
  await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
  res.json({ message: 'Role updated. The user will need to log in again for it to take effect.' });
});

module.exports = router;
