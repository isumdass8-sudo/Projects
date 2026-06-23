const { pool } = require('../config/db');

// Get all books, optionally filtered by a search term (title, author, isbn)
async function getAllBooks(search) {
  let query = `
    SELECT books.*, authors.name AS author_name, categories.name AS category_name
    FROM books
    LEFT JOIN authors ON books.author_id = authors.id
    LEFT JOIN categories ON books.category_id = categories.id
  `;
  const params = [];

  if (search) {
    query += ` WHERE books.title LIKE ? OR authors.name LIKE ? OR books.isbn LIKE ?`;
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY books.created_at DESC';

  const [rows] = await pool.query(query, params);
  return rows;
}

// Get a single book by id
async function getBookById(id) {
  const [rows] = await pool.query(
    `SELECT books.*, authors.name AS author_name, categories.name AS category_name
     FROM books
     LEFT JOIN authors ON books.author_id = authors.id
     LEFT JOIN categories ON books.category_id = categories.id
     WHERE books.id = ?`,
    [id]
  );
  return rows[0];
}

// Create a new book
async function createBook(data) {
  const {
    title, author_id, category_id, isbn,
    total_copies, shelf_number, cover_image
  } = data;

  // available_copies starts equal to total_copies when a book is first added
  const [result] = await pool.query(
    `INSERT INTO books
      (title, author_id, category_id, isbn, total_copies, available_copies, shelf_number, cover_image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, author_id || null, category_id || null, isbn || null,
     total_copies || 1, total_copies || 1, shelf_number || null, cover_image || null]
  );
  return result.insertId;
}

// Update an existing book
async function updateBook(id, data) {
  const {
    title, author_id, category_id, isbn,
    total_copies, available_copies, shelf_number, cover_image
  } = data;

  const [result] = await pool.query(
    `UPDATE books SET
       title = ?, author_id = ?, category_id = ?, isbn = ?,
       total_copies = ?, available_copies = ?, shelf_number = ?, cover_image = ?
     WHERE id = ?`,
    [title, author_id || null, category_id || null, isbn || null,
     total_copies, available_copies, shelf_number || null, cover_image || null, id]
  );
  return result.affectedRows > 0;
}

// Delete a book
async function deleteBook(id) {
  const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
