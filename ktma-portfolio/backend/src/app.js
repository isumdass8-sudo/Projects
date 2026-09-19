const express = require('express');
const cors = require('cors');
require('dotenv').config();

const destinationsRoutes = require('./routes/destinations.routes');
const membersRoutes = require('./routes/members.routes');
const eventsRoutes = require('./routes/events.routes');
const galleryRoutes = require('./routes/gallery.routes');
const contactRoutes = require('./routes/contact.routes');

const app = express();

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ktma-api', time: new Date().toISOString() });
});

app.use('/api/destinations', destinationsRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

module.exports = app;
