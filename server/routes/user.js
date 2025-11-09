const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user protocols
router.get('/protocols', auth, (req, res) => {
  try {
    res.json({ protocols: req.user.protocols || [] });
  } catch (error) {
    console.error('Get protocols error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add protocol to user
router.post('/protocols', auth, (req, res) => {
  try {
    const { protocolId, title, description, category, difficulty, timeRequired, frequency, benefits, instructions } = req.body;
    const db = req.app.locals.db;

    // Get fresh user data
    const user = db.get('users').find({ id: req.user.id }).value();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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
router.delete('/protocols/:protocolId', auth, (req, res) => {
  try {
    const { protocolId } = req.params;
    const db = req.app.locals.db;
    
    db.get('users').find({ id: req.user.id }).get('protocols').remove({ protocolId }).write();

    res.json({ message: 'Protocol removed successfully' });
  } catch (error) {
    console.error('Remove protocol error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle protocol completion for a specific date
router.post('/protocols/:protocolId/completion', auth, (req, res) => {
  try {
    const { protocolId } = req.params;
    const { date } = req.body;
    const db = req.app.locals.db;

    const userRef = db.get('users').find({ id: req.user.id });
    const protocol = userRef.get('protocols').find({ protocolId }).value();

    if (!protocol) {
      return res.status(404).json({ message: 'Protocol not found' });
    }

    const dateObj = new Date(date);
    const history = Array.isArray(protocol.progressHistory) ? [...protocol.progressHistory] : [];
    const idx = history.findIndex(entry => new Date(entry.date).toDateString() === dateObj.toDateString());

    if (idx > -1) {
      // Toggle off
      history.splice(idx, 1);
    } else {
      // Toggle on
      history.push({ date: dateObj.toISOString(), notes: req.body.notes || '' });
    }

    const updatedProtocol = { ...protocol, progressHistory: history };
    userRef.get('protocols').find({ protocolId }).assign(updatedProtocol).write();

    res.json({
      message: 'Protocol completion toggled successfully',
      protocol: updatedProtocol
    });
  } catch (error) {
    console.error('Toggle completion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update protocol progress
router.put('/protocols/:protocolId/progress', auth, (req, res) => {
  try {
    const { protocolId } = req.params;
    const { value, notes } = req.body;
    const db = req.app.locals.db;

    const userRef = db.get('users').find({ id: req.user.id });
    const protocol = userRef.get('protocols').find({ protocolId }).value();

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

    userRef.get('protocols').find({ protocolId }).assign(updatedProtocol).write();

    res.json({
      message: 'Progress updated successfully',
      protocol: updatedProtocol
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get protocol progress history
router.get('/protocols/:protocolId/progress', auth, (req, res) => {
  try {
    const { protocolId } = req.params;
    
    const protocol = req.user.protocols.find(p => p.protocolId === protocolId);
    if (!protocol) {
      return res.status(404).json({ message: 'Protocol not found' });
    }

    res.json({
      protocol: protocol,
      progress: protocol.progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.put('/preferences', auth, (req, res) => {
  try {
    const { notifications, theme } = req.body;
    const db = req.app.locals.db;

    const userRef = db.get('users').find({ id: req.user.id });
    const preferences = { ...userRef.value().preferences };

    if (notifications !== undefined) {
      preferences.notifications = notifications;
    }
    if (theme !== undefined) {
      preferences.theme = theme;
    }

    userRef.assign({ preferences }).write();

    res.json({
      message: 'Preferences updated successfully',
      preferences: preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/stats', auth, (req, res) => {
  try {
    const protocols = req.user.protocols || [];
    const protocolsWithProgress = protocols.filter(p => p.progress && p.progress.value > 0);
    
    const stats = {
      totalProtocols: protocols.length,
      activeProtocols: protocolsWithProgress.length,
      averageProgress: protocolsWithProgress.length > 0 
        ? Math.round(protocolsWithProgress.reduce((sum, p) => sum + p.progress.value, 0) / protocolsWithProgress.length)
        : 0,
      topPerforming: protocolsWithProgress
        .sort((a, b) => b.progress.value - a.progress.value)
        .slice(0, 3)
        .map(p => ({
          title: p.title,
          progress: p.progress.value
        })),
      needsAttention: protocolsWithProgress
        .filter(p => p.progress.value < 50)
        .sort((a, b) => a.progress.value - b.progress.value)
        .slice(0, 3)
        .map(p => ({
          title: p.title,
          progress: p.progress.value
        }))
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user data (protocols and progress, but keep account)
router.delete('/data', auth, (req, res) => {
  try {
    const db = req.app.locals.db;
    
    if (!db) {
      console.error('Database not available');
      return res.status(500).json({ message: 'Database not available' });
    }

    if (!req.user || !req.user.id) {
      console.error('User ID not found in request');
      return res.status(400).json({ message: 'User ID not found' });
    }

    const userRef = db.get('users').find({ id: req.user.id });
    
    // Check if user exists
    const user = userRef.value();
    if (!user) {
      console.error('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear protocols array (this removes all protocols and their progress data)
    // Ensure protocols property exists before clearing
    userRef.assign({ 
      protocols: [],
      // Reset progress-related fields if they exist at user level
    }).write();

    // Get updated user
    const updatedUser = userRef.value();
    if (!updatedUser) {
      console.error('Failed to retrieve updated user after deletion');
      return res.status(500).json({ message: 'Failed to retrieve updated user' });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

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

module.exports = router;
