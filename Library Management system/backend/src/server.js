require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON request bodies

// Basic health-check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Library Management API is running' });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/members', require('./routes/member.routes'));
app.use('/api/issues', require('./routes/issue.routes'));
app.use('/api/stats',  require('./routes/stats.routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await testConnection();
});
