const { pool } = require('../config/db');

async function getDashboardStats(req, res) {
  const [[{ totalBanks }]] = await pool.query('SELECT COUNT(*) AS totalBanks FROM banks');
  const [[{ totalATMs }]] = await pool.query('SELECT COUNT(*) AS totalATMs FROM atms');
  const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
  const [[{ openReports }]] = await pool.query(
    "SELECT COUNT(*) AS openReports FROM reports WHERE status = 'open'"
  );

  const [mostSearchedBanks] = await pool.query(
    `SELECT b.name, COUNT(*) AS views
     FROM search_history sh
     JOIN atms a ON sh.atm_id = a.atm_id
     JOIN banks b ON a.bank_id = b.bank_id
     GROUP BY b.bank_id ORDER BY views DESC LIMIT 5`
  );

  const [mostVisitedATMs] = await pool.query(
    `SELECT a.name, a.city, COUNT(*) AS views
     FROM search_history sh JOIN atms a ON sh.atm_id = a.atm_id
     GROUP BY a.atm_id ORDER BY views DESC LIMIT 5`
  );

  const [districtCounts] = await pool.query(
    `SELECT d.name, COUNT(a.atm_id) AS atm_count
     FROM districts d LEFT JOIN atms a ON a.district_id = d.district_id
     GROUP BY d.district_id ORDER BY atm_count DESC`
  );

  res.json({
    totals: { totalBanks, totalATMs, totalUsers, openReports },
    mostSearchedBanks,
    mostVisitedATMs,
    districtCounts,
  });
}

module.exports = { getDashboardStats };
