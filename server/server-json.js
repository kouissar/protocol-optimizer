const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Database file path - use environment variable if set (for Kubernetes), otherwise default location
const dbPath = process.env.DB_PATH || path.join(__dirname, 'db.json');

// Initialize database
const initDB = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [] }, null, 2));
  }
};

// Read database
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [] };
  }
};

// Write database
const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
  }
};

const resetProtocolProgress = (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  user.protocols.forEach(protocol => {
    const progressDate = new Date(protocol.progress.date);
    progressDate.setHours(0, 0, 0, 0);

    if (progressDate < today) {
      protocol.progress.value = 0;
      protocol.progress.notes = '';
    }
  });
};

// Initialize database
initDB();

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
    const db = readDB();
    const user = db.users.find(u => u.id === decoded.userId);
    
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

    const db = readDB();

    // Check if user already exists
    const existingUser = db.users.find(u => u.email === email);
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

    db.users.push(user);
    writeDB(db);

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

    const db = readDB();

    // Find user
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();
    writeDB(db);

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
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);

    resetProtocolProgress(user);
    writeDB(db);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        protocols: user.protocols,
        preferences: user.preferences,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
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

    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);

    // Check if protocol already exists
    const existingProtocol = user.protocols.find(p => p.protocolId === protocolId);
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

    user.protocols.push(newProtocol);
    writeDB(db);

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
    
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    user.protocols = user.protocols.filter(p => p.protocolId !== protocolId);
    writeDB(db);

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

    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    const protocol = user.protocols.find(p => p.protocolId === protocolId);
    
    if (!protocol) {
      return res.status(404).json({ message: 'Protocol not found' });
    }

    // Update progress
    protocol.progress = {
      value: Math.max(0, Math.min(100, value || 0)),
      notes: notes || '',
      date: new Date().toISOString()
    };

    writeDB(db);

    res.json({
      message: 'Progress updated successfully',
      protocol: protocol
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle protocol completion for a specific date
app.post('/api/user/protocols/:protocolId/completion', auth, (req, res) => {
  try {
    const { protocolId } = req.params;
    const { date } = req.body;

    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    const protocol = user.protocols.find(p => p.protocolId === protocolId);

    if (!protocol) {
      return res.status(404).json({ message: 'Protocol not found' });
    }

    const dateObj = new Date(date);
    const history = Array.isArray(protocol.progressHistory) ? protocol.progressHistory : [];
    const idx = history.findIndex(entry => new Date(entry.date).toDateString() === dateObj.toDateString());

    if (idx > -1) {
      // Entry exists, update it
      history[idx].notes = req.body.notes || history[idx].notes;
    } else {
      // Entry does not exist, create it
      history.push({ date: dateObj.toISOString(), notes: req.body.notes || '' });
    }

    protocol.progressHistory = history;
    writeDB(db);

    res.json({
      message: 'Protocol completion toggled successfully',
      protocol: protocol
    });
  } catch (error) {
    console.error('Toggle completion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user data (protocols and progress, but keep account)
app.delete('/api/user/data', auth, (req, res) => {
  try {
    const db = readDB();
    
    if (!req.user || !req.user.id) {
      console.error('User ID not found in request');
      return res.status(400).json({ message: 'User ID not found' });
    }

    const user = db.users.find(u => u.id === req.user.id);
    
    if (!user) {
      console.error('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear protocols array (this removes all protocols and their progress data)
    user.protocols = [];
    writeDB(db);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      message: 'User data deleted successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Delete user data error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Serve static files from the React app if build exists (production)
const buildDir = path.join(__dirname, '../build');
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
  console.log(`💾 Using JSON file storage: ${dbPath}`);
});

module.exports = app;
