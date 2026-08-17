const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const pool = require('../config/db');

router.get('/users', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

router.patch('/employers/:id/verify', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    await pool.query(
      'UPDATE employer_profiles SET is_verified = TRUE WHERE user_id = ?',
      [req.params.id]
    );
    res.status(200).json({ message: 'Employer verified successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to verify employer.' });
  }
});

module.exports = router;