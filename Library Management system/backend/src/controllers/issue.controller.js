const {
  getAllIssues, getIssuesByMember, getIssueById,
  getAvailableCopies, issueBook, returnBook, createFine
} = require('../models/issue.model');
const { getMemberById, getMemberByUserId } = require('../models/member.model');
const { getBookById } = require('../models/book.model');
const { LOAN_DURATION_DAYS, DAILY_FINE_RATE } = require('../config/library.config');

// Helper: format a JS Date as YYYY-MM-DD for MySQL DATE columns
function toDateString(date) {
  return date.toISOString().split('T')[0];
}

// GET /api/issues?status=issued
// Librarian/Admin - view all issue records, optionally filtered by status
async function listIssues(req, res) {
  try {
    const { status } = req.query;
    const issues = await getAllIssues(status);
    return res.json({ issues });
  } catch (err) {
    console.error('List issues error:', err);
    return res.status(500).json({ message: 'Something went wrong fetching issues' });
  }
}

// GET /api/issues/me
// Logged-in member - view their own borrowing history
async function getMyIssues(req, res) {
  try {
    const member = await getMemberByUserId(req.user.id);
    if (!member) {
      return res.status(404).json({ message: 'No member profile found for your account' });
    }
    const issues = await getIssuesByMember(member.id);
    return res.json({ issues });
  } catch (err) {
    console.error('Get my issues error:', err);
    return res.status(500).json({ message: 'Something went wrong fetching your borrowing history' });
  }
}

// POST /api/issues
// Librarian/Admin - issue a book to a member
async function createIssue(req, res) {
  try {
    const { book_id, member_id } = req.body;

    if (!book_id || !member_id) {
      return res.status(400).json({ message: 'book_id and member_id are required' });
    }

    // Make sure the book exists and has copies available
    const book = await getBookById(book_id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.available_copies <= 0) {
      return res.status(400).json({ message: 'No available copies of this book to issue' });
    }

    // Make sure the member exists
    const member = await getMemberById(member_id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    if (member.status !== 'active') {
      return res.status(400).json({ message: 'This member is not active and cannot borrow books' });
    }

    // Calculate issue date (today) and due date (today + loan duration)
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + LOAN_DURATION_DAYS);

    const issueId = await issueBook({
      book_id,
      member_id,
      issue_date: toDateString(issueDate),
      due_date: toDateString(dueDate)
    });

    const issue = await getIssueById(issueId);
    return res.status(201).json({ message: 'Book issued successfully', issue });
  } catch (err) {
    console.error('Create issue error:', err);
    return res.status(500).json({ message: 'Something went wrong issuing the book' });
  }
}

// PUT /api/issues/:id/return
// Librarian/Admin - mark a book as returned, calculate fine if overdue
async function processReturn(req, res) {
  try {
    const issue = await getIssueById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue record not found' });
    }
    if (issue.status === 'returned') {
      return res.status(400).json({ message: 'This book has already been returned' });
    }

    const returnDate = new Date();
    await returnBook(issue.id, issue.book_id, toDateString(returnDate));

    // Calculate fine if returned after the due date
    const dueDate = new Date(issue.due_date);
    let fine = null;

    // Zero out time portions so we compare whole days only
    returnDate.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const daysLate = Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24));

    if (daysLate > 0) {
      const fineAmount = daysLate * DAILY_FINE_RATE;
      const fineId = await createFine(issue.id, fineAmount);
      fine = { id: fineId, issue_id: issue.id, amount: fineAmount, days_late: daysLate };
    }

    const updatedIssue = await getIssueById(issue.id);
    return res.json({
      message: fine ? 'Book returned with a late fine' : 'Book returned successfully',
      issue: updatedIssue,
      fine
    });
  } catch (err) {
    console.error('Process return error:', err);
    return res.status(500).json({ message: 'Something went wrong processing the return' });
  }
}

module.exports = { listIssues, getMyIssues, createIssue, processReturn };
