const { pool } = require('../config/db');

// Get all issues, joined with book and member info
async function getAllIssues(status) {
  let query = `
    SELECT book_issues.*, books.title AS book_title,
           users.name AS member_name, members.student_id
    FROM book_issues
    JOIN books ON book_issues.book_id = books.id
    JOIN members ON book_issues.member_id = members.id
    JOIN users ON members.user_id = users.id
  `;
  const params = [];

  if (status) {
    query += ' WHERE book_issues.status = ?';
    params.push(status);
  }

  query += ' ORDER BY book_issues.issue_date DESC';

  const [rows] = await pool.query(query, params);
  return rows;
}

// Get issue history for a specific member
async function getIssuesByMember(memberId) {
  const [rows] = await pool.query(
    `SELECT book_issues.*, books.title AS book_title
     FROM book_issues
     JOIN books ON book_issues.book_id = books.id
     WHERE book_issues.member_id = ?
     ORDER BY book_issues.issue_date DESC`,
    [memberId]
  );
  return rows;
}

// Get a single issue by id
async function getIssueById(id) {
  const [rows] = await pool.query(
    `SELECT book_issues.*, books.title AS book_title, books.available_copies,
            users.name AS member_name, members.student_id
     FROM book_issues
     JOIN books ON book_issues.book_id = books.id
     JOIN members ON book_issues.member_id = members.id
     JOIN users ON members.user_id = users.id
     WHERE book_issues.id = ?`,
    [id]
  );
  return rows[0];
}

// Check how many copies of a book are currently available
async function getAvailableCopies(bookId) {
  const [rows] = await pool.query(
    'SELECT available_copies FROM books WHERE id = ?',
    [bookId]
  );
  return rows[0] ? rows[0].available_copies : null;
}

// Create a new issue record and decrease the book's available copies.
// Wrapped in a transaction so both steps succeed or both fail together.
async function issueBook({ book_id, member_id, issue_date, due_date }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO book_issues (book_id, member_id, issue_date, due_date, status)
       VALUES (?, ?, ?, ?, 'issued')`,
      [book_id, member_id, issue_date, due_date]
    );

    await connection.query(
      'UPDATE books SET available_copies = available_copies - 1 WHERE id = ?',
      [book_id]
    );

    await connection.commit();
    return result.insertId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

// Mark an issue as returned and increase the book's available copies.
async function returnBook(issueId, bookId, returnDate) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE book_issues SET return_date = ?, status = 'returned' WHERE id = ?`,
      [returnDate, issueId]
    );

    await connection.query(
      'UPDATE books SET available_copies = available_copies + 1 WHERE id = ?',
      [bookId]
    );

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

// Create a fine record for an issue
async function createFine(issueId, amount) {
  const [result] = await pool.query(
    'INSERT INTO fines (issue_id, amount) VALUES (?, ?)',
    [issueId, amount]
  );
  return result.insertId;
}

module.exports = {
  getAllIssues, getIssuesByMember, getIssueById,
  getAvailableCopies, issueBook, returnBook, createFine
};
