const express = require('express');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { summarize } = require('../utils/payoutEngine');
const { contributionEmail } = require('../utils/mailer');
const { emitToAdmins } = require('../utils/socket');

const router = express.Router();
router.use(requireAuth);

// POST /api/contributions  { plan_id, amount, start_date? }
router.post('/', async (req, res) => {
  try {
    const { plan_id, amount, start_date } = req.body;
    if (!plan_id || !amount) {
      return res.status(400).json({ error: 'plan_id and amount are required.' });
    }

    const [planRows] = await pool.query('SELECT * FROM plans WHERE id = ?', [plan_id]);
    if (planRows.length === 0) return res.status(404).json({ error: 'Plan not found.' });
    const plan = planRows[0];

    if (Number(amount) < Number(plan.min_contribution)) {
      return res.status(400).json({
        error: `Minimum contribution for this plan is Rs. ${plan.min_contribution}.`
      });
    }

    const startDate = start_date || new Date().toISOString().slice(0, 10);

    const [result] = await pool.query(
      `INSERT INTO contributions (user_id, plan_id, amount, monthly_rate, duration_months, start_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, plan_id, amount, plan.monthly_rate, plan.duration_months, startDate]
    );

    const [[user]] = await pool.query('SELECT full_name, email FROM users WHERE id = ?', [req.user.id]);
    contributionEmail(user, plan, { amount }).catch(() => {});
    emitToAdmins('new_contribution', {
      id: result.insertId,
      full_name: user.full_name,
      plan_name: plan.name,
      amount: Number(amount),
      created_at: new Date().toISOString()
    });

    res.status(201).json({ id: result.insertId, message: 'Contribution created successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create contribution.' });
  }
});

// GET /api/contributions/me  -> all of the logged-in customer's contributions + accrued income
router.get('/me', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, p.name AS plan_name, p.code AS plan_code, p.icon AS plan_icon
     FROM contributions c
     JOIN plans p ON p.id = c.plan_id
     WHERE c.user_id = ?
     ORDER BY c.created_at DESC`,
    [req.user.id]
  );

  const withSummary = rows.map((c) => {
    const summary = summarize(c);
    return {
      ...c,
      amount: Number(c.amount),
      monthly_rate: Number(c.monthly_rate),
      totalPaidOut: summary.totalPaidOut,
      monthsCompleted: summary.monthsCompleted,
      monthsRemaining: summary.monthsRemaining,
      isMatured: summary.isMatured
    };
  });

  const totals = withSummary.reduce(
    (acc, c) => ({
      totalContributed: acc.totalContributed + Number(c.amount),
      totalIncome: acc.totalIncome + c.totalPaidOut
    }),
    { totalContributed: 0, totalIncome: 0 }
  );

  res.json({ contributions: withSummary, totals });
});

// GET /api/contributions/:id/payouts -> full month-by-month schedule for one contribution
router.get('/:id/payouts', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM contributions WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Contribution not found.' });

  const summary = summarize(rows[0]);
  res.json(summary);
});

module.exports = router;
