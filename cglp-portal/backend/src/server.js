const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const planRoutes = require('./routes/plans');
const contributionRoutes = require('./routes/contributions');
const contentRoutes = require('./routes/content');
const adminRoutes = require('./routes/admin');
const landsRoutes = require('./routes/lands');
const documentRoutes = require('./routes/documents');
const certificateRoutes = require('./routes/certificates');
const chatRoutes = require('./routes/chat');
const { initSocket } = require('./utils/socket');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/contributions', certificateRoutes); // adds /:id/agreement, /:id/certificate
app.use('/api', contentRoutes); // /api/testimonials, /api/posts, /api/contact
app.use('/api/admin', adminRoutes);
app.use('/api/lands', landsRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', certificateRoutes); // /api/verify/:id (public)

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`CGLP Portal API running on http://localhost:${PORT}`);
});
