const {
  getAllBooks, getBookById, createBook, updateBook, deleteBook
} = require('../models/book.model');

// GET /api/books?search=...
// Anyone can view books (no login required)
async function listBooks(req, res) {
  try {
    const { search } = req.query;
    const books = await getAllBooks(search);
    return res.json({ books });
  } catch (err) {
    console.error('List books error:', err);
    return res.status(500).json({ message: 'Something went wrong fetching books' });
  }
}

// GET /api/books/:id
async function getBook(req, res) {
  try {
    const book = await getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.json({ book });
  } catch (err) {
    console.error('Get book error:', err);
    return res.status(500).json({ message: 'Something went wrong fetching the book' });
  }
}

// POST /api/books
// Only librarians/admins can add books (enforced via route middleware)
async function addBook(req, res) {
  try {
    const { title, total_copies } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Book title is required' });
    }
    if (total_copies !== undefined && total_copies < 0) {
      return res.status(400).json({ message: 'Total copies cannot be negative' });
    }

    const bookId = await createBook(req.body);
    const book = await getBookById(bookId);

    return res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    console.error('Add book error:', err);
    // Handle duplicate ISBN nicely
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A book with this ISBN already exists' });
    }
    return res.status(500).json({ message: 'Something went wrong adding the book' });
  }
}

// PUT /api/books/:id
async function editBook(req, res) {
  try {
    const existing = await getBookById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Merge existing values with whatever fields were sent in the request
    const updated = { ...existing, ...req.body };

    const success = await updateBook(req.params.id, updated);
    if (!success) {
      return res.status(500).json({ message: 'Failed to update book' });
    }

    const book = await getBookById(req.params.id);
    return res.json({ message: 'Book updated successfully', book });
  } catch (err) {
    console.error('Edit book error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'A book with this ISBN already exists' });
    }
    return res.status(500).json({ message: 'Something went wrong updating the book' });
  }
}

// DELETE /api/books/:id
async function removeBook(req, res) {
  try {
    const existing = await getBookById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await deleteBook(req.params.id);
    return res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Delete book error:', err);
    return res.status(500).json({ message: 'Something went wrong deleting the book' });
  }
}

module.exports = { listBooks, getBook, addBook, editBook, removeBook };
