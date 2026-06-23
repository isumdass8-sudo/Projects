const { pool } = require('../config/db');

async function getOverview(req, res) {
  try {
    const [[books]]   = await pool.query('SELECT COUNT(*) AS total, SUM(available_copies) AS available, SUM(total_copies) AS copies FROM books');
    const [[members]] = await pool.query('SELECT COUNT(*) AS total FROM members WHERE status = "active"');
    const [[issued]]  = await pool.query('SELECT COUNT(*) AS total FROM book_issues WHERE status = "issued"');
    const [[overdue]] = await pool.query('SELECT COUNT(*) AS total FROM book_issues WHERE status = "issued" AND due_date < CURDATE()');
    const [[fines]]   = await pool.query('SELECT COALESCE(SUM(amount),0) AS total, COALESCE(SUM(CASE WHEN paid=1 THEN amount ELSE 0 END),0) AS collected FROM fines');
    res.json({ totalBooks: books.total, availableCopies: books.available, totalCopies: books.copies, activeMembers: members.total, issuedBooks: issued.total, overdueBooks: overdue.total, totalFines: fines.total, collectedFines: fines.collected });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Failed to load overview' }); }
}

async function getMonthlyTrends(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT DATE_FORMAT(issue_date, '%Y-%m') AS month, COUNT(*) AS issued,
             SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) AS returned
      FROM book_issues
      WHERE issue_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month ORDER BY month ASC
    `);
    res.json({ trends: rows });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Failed to load trends' }); }
}

async function getPopularBooks(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT books.title, COUNT(book_issues.id) AS borrow_count
      FROM book_issues JOIN books ON book_issues.book_id = books.id
      GROUP BY books.id, books.title ORDER BY borrow_count DESC LIMIT 8
    `);
    res.json({ books: rows });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Failed to load popular books' }); }
}

async function getIssueStatus(req, res) {
  try {
    const now = new Date().toISOString().split('T')[0];
    const [rows] = await pool.query(`
      SELECT SUM(CASE WHEN status='returned' THEN 1 ELSE 0 END) AS returned,
             SUM(CASE WHEN status='issued' AND due_date >= ? THEN 1 ELSE 0 END) AS on_time,
             SUM(CASE WHEN status='issued' AND due_date < ? THEN 1 ELSE 0 END) AS overdue
      FROM book_issues
    `, [now, now]);
    const r = rows[0];
    res.json({ breakdown: [
      { name: 'Returned', value: Number(r.returned) },
      { name: 'On Time',  value: Number(r.on_time)  },
      { name: 'Overdue',  value: Number(r.overdue)  },
    ]});
  } catch (err) { console.error(err); res.status(500).json({ message: 'Failed to load issue status' }); }
}

async function getReport(req, res) {
  try {
    const { type = 'issues', from, to } = req.query;
    let rows = [];
    if (type === 'issues') {
      let q = `SELECT book_issues.id, books.title AS book, books.isbn, users.name AS member,
               members.student_id, book_issues.issue_date, book_issues.due_date,
               book_issues.return_date, book_issues.status
               FROM book_issues
               JOIN books ON book_issues.book_id=books.id
               JOIN members ON book_issues.member_id=members.id
               JOIN users ON members.user_id=users.id WHERE 1=1`;
      const p = [];
      if (from) { q += ' AND book_issues.issue_date >= ?'; p.push(from); }
      if (to)   { q += ' AND book_issues.issue_date <= ?'; p.push(to); }
      q += ' ORDER BY book_issues.issue_date DESC';
      [rows] = await pool.query(q, p);
    } else if (type === 'books') {
      [rows] = await pool.query(`SELECT books.id, books.title, books.isbn, authors.name AS author,
               categories.name AS category, books.total_copies, books.available_copies, books.shelf_number
               FROM books LEFT JOIN authors ON books.author_id=authors.id
               LEFT JOIN categories ON books.category_id=categories.id ORDER BY books.title ASC`);
    } else if (type === 'fines') {
      let q = `SELECT fines.id, books.title AS book, users.name AS member, book_issues.due_date,
               book_issues.return_date, fines.amount, fines.paid, fines.payment_date
               FROM fines JOIN book_issues ON fines.issue_id=book_issues.id
               JOIN books ON book_issues.book_id=books.id
               JOIN members ON book_issues.member_id=members.id
               JOIN users ON members.user_id=users.id WHERE 1=1`;
      const p = [];
      if (from) { q += ' AND book_issues.return_date >= ?'; p.push(from); }
      if (to)   { q += ' AND book_issues.return_date <= ?'; p.push(to); }
      [rows] = await pool.query(q, p);
    }
    res.json({ report: rows, type, from, to });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Failed to generate report' }); }
}

module.exports = { getOverview, getMonthlyTrends, getPopularBooks, getIssueStatus, getReport };
