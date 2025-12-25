const express = require('express');
const cors = require('cors');
const Lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Set up lowdb for file-based storage
// Use data subdirectory if it exists (for Kubernetes volume mounts), otherwise use current directory
const dbPath = process.env.DB_PATH || path.join(__dirname, 'db.json');
const adapter = new FileSync(dbPath);
const db = Lowdb(adapter);

// Initialize database with default data
db.defaults({ users: [] }).write();

// Make db available to routes via app.locals
app.locals.db = db;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Huberman Protocol API is running' });
});

// Serve static files from the React app if build exists (production)
const buildDir = path.join(__dirname, '../build');
const fs = require('fs');
if (fs.existsSync(buildDir)) {
  app.use(express.static(buildDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
  });
} else {
  // In dev, avoid ENOENT by returning a simple message on non-API routes
  app.get('/', (req, res) => {
    res.send('API server running. Frontend dev server is at http://localhost:3000');
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Using file-based storage: ${dbPath}`);
});

module.exports = app;
