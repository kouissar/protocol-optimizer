const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Set up lowdb for file-based storage
const adapter = new FileSync(path.join(__dirname, 'db.json'));
const db = Lowdb(adapter);

// Initialize database with default data
db.defaults({ users: [] }).write();

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = db.get('users').find({ id: decoded.userId }).value();
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Huberman Protocol API is running' });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = db.get('users').find({ email }).value();
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const userId = Date.now().toString();
    const user = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      protocols: [],
      preferences: {
        notifications: true,
        theme: 'light'
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    db.get('users').push(user).write();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        protocols: user.protocols
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = db.get('users').find({ email }).value();
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    db.get('users').find({ id: user.id }).assign({ lastLogin: new Date().toISOString() }).write();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        protocols: user.protocols
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
app.get('/api/auth/me', auth, (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        protocols: req.user.protocols,
        preferences: req.user.preferences,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user protocols
app.get('/api/user/protocols', auth, (req, res) => {
  try {
    res.json({ protocols: req.user.protocols });
  } catch (error) {
    console.error('Get protocols error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add protocol to user
app.post('/api/user/protocols', auth, (req, res) => {
  try {
    const { protocolId, title, description, category, difficulty, timeRequired, frequency, benefits, instructions } = req.body;

    // Check if protocol already exists
    const existingProtocol = req.user.protocols.find(p => p.protocolId === protocolId);
    if (existingProtocol) {
      return res.status(400).json({ message: 'Protocol already added to your wall' });
    }

    // Add new protocol
    const newProtocol = {
      protocolId,
      title,
      description,
      category,
      difficulty,
      timeRequired,
      frequency,
      benefits,
      instructions,
      addedDate: new Date().toISOString(),
      progress: {
        value: 0,
        notes: '',
        date: new Date().toISOString()
      }
    };

    // Update user in database
    db.get('users').find({ id: req.user.id }).get('protocols').push(newProtocol).write();

    res.status(201).json({
      message: 'Protocol added successfully',
      protocol: newProtocol
    });
  } catch (error) {
    console.error('Add protocol error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove protocol from user
app.delete('/api/user/protocols/:protocolId', auth, (req, res) => {
  try {
    const { protocolId } = req.params;
    
    db.get('users').find({ id: req.user.id }).get('protocols').remove({ protocolId }).write();

    res.json({ message: 'Protocol removed successfully' });
  } catch (error) {
    console.error('Remove protocol error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update protocol progress
app.put('/api/user/protocols/:protocolId/progress', auth, (req, res) => {
  try {
    const { protocolId } = req.params;
    const { value, notes } = req.body;

    const protocol = req.user.protocols.find(p => p.protocolId === protocolId);
    if (!protocol) {
      return res.status(404).json({ message: 'Protocol not found' });
    }

    // Update progress
    const updatedProtocol = {
      ...protocol,
      progress: {
        value: Math.max(0, Math.min(100, value || 0)),
        notes: notes || '',
        date: new Date().toISOString()
      }
    };

    // Update in database
    db.get('users').find({ id: req.user.id }).get('protocols').find({ protocolId }).assign(updatedProtocol).write();

    res.json({
      message: 'Progress updated successfully',
      protocol: updatedProtocol
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Using file-based storage: server/db.json`);
});

module.exports = app;
