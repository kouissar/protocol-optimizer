const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Get all users
router.get('/users', [auth, admin], (req, res) => {
  try {
    const db = req.app.locals.db;
    const users = db.get('users').value();
    
    // Return users without passwords
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json(sanitizedUsers);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', [auth, admin], (req, res) => {
  try {
    const { id } = req.params;
    const db = req.app.locals.db;

    // Prevent deleting self
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own admin account' });
    }

    const userToRemove = db.get('users').find({ id }).value();
    if (!userToRemove) {
      return res.status(404).json({ message: 'User not found' });
    }

    db.get('users').remove({ id }).write();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.patch('/users/:id/role', [auth, admin], (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const db = req.app.locals.db;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Prevent demoting self
    if (id === req.user.id && role !== 'admin') {
      return res.status(400).json({ message: 'Cannot demote your own admin account' });
    }

    const userToUpdate = db.get('users').find({ id }).value();
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    db.get('users').find({ id }).assign({ role }).write();
    
    res.json({ 
      message: 'User role updated successfully',
      userId: id,
      newRole: role 
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
