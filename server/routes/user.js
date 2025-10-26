const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user protocols
router.get('/protocols', auth, async (req, res) => {
  try {
    res.json({ protocols: req.user.protocols });
  } catch (error) {
    console.error('Get protocols error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add protocol to user
router.post('/protocols', auth, async (req, res) => {
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
      addedDate: new Date(),
      progress: {
        value: 0,
        notes: '',
        date: new Date()
      }
    };

    req.user.protocols.push(newProtocol);
    await req.user.save();

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
router.delete('/protocols/:protocolId', auth, async (req, res) => {
  try {
    const { protocolId } = req.params;
    
    req.user.protocols = req.user.protocols.filter(p => p.protocolId !== protocolId);
    await req.user.save();

    res.json({ message: 'Protocol removed successfully' });
  } catch (error) {
    console.error('Remove protocol error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update protocol progress
router.put('/protocols/:protocolId/progress', auth, async (req, res) => {
  try {
    const { protocolId } = req.params;
    const { value, notes } = req.body;

    const protocol = req.user.protocols.find(p => p.protocolId === protocolId);
    if (!protocol) {
      return res.status(404).json({ message: 'Protocol not found' });
    }

    // Update progress
    protocol.progress = {
      value: Math.max(0, Math.min(100, value || 0)),
      notes: notes || '',
      date: new Date()
    };

    await req.user.save();

    res.json({
      message: 'Progress updated successfully',
      protocol: protocol
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get protocol progress history
router.get('/protocols/:protocolId/progress', auth, async (req, res) => {
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
router.put('/preferences', auth, async (req, res) => {
  try {
    const { notifications, theme } = req.body;

    if (notifications !== undefined) {
      req.user.preferences.notifications = notifications;
    }
    if (theme !== undefined) {
      req.user.preferences.theme = theme;
    }

    await req.user.save();

    res.json({
      message: 'Preferences updated successfully',
      preferences: req.user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const protocols = req.user.protocols;
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

module.exports = router;
