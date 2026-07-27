const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, PNG, or JPG files are allowed.'));
    }
  }
});

// POST /api/documents  (multipart form, field name: "document")
router.post('/', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const { contribution_id } = req.body;

    const [result] = await pool.query(
      'INSERT INTO documents (user_id, contribution_id, file_name, file_path) VALUES (?, ?, ?, ?)',
      [req.user.id, contribution_id || null, req.file.originalname, req.file.filename]
    );

    res.status(201).json({ id: result.insertId, message: 'Document uploaded successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Upload failed.' });
  }
});

// GET /api/documents/me
router.get('/me', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, file_name, contribution_id, uploaded_at FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC',
    [req.user.id]
  );
  res.json(rows);
});

// GET /api/documents/:id/download
router.get('/:id/download', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM documents WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Document not found.' });

  const filePath = path.join(uploadDir, rows[0].file_path);
  res.download(filePath, rows[0].file_name);
});

module.exports = router;
