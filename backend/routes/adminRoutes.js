const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const pool = require('../config/db');

// GET /api/admin/users — সব users দেখবে
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

// PATCH /api/admin/employers/:id/verify — employer verify করবে
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

// GET /api/admin/jobs/pending — pending approval jobs দেখবে
router.get('/jobs/pending', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const [jobs] = await pool.query(
      `SELECT j.*, u.name AS employer_name, e.company_name
       FROM job_listings j
       JOIN users u ON j.employer_id = u.id
       JOIN employer_profiles e ON j.employer_id = e.user_id
       WHERE j.status = 'pending_approval'
       ORDER BY j.created_at DESC`
    );
    res.status(200).json({ jobs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending jobs.' });
  }
});

// PATCH /api/admin/jobs/:id/approve — job approve করবে
router.patch('/jobs/:id/approve', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    await pool.query(
      "UPDATE job_listings SET status = 'active' WHERE id = ?",
      [req.params.id]
    );
    res.status(200).json({ message: 'Job approved successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve job.' });
  }
});

// PATCH /api/admin/jobs/:id/reject — job reject করবে
router.patch('/jobs/:id/reject', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    await pool.query(
      "UPDATE job_listings SET status = 'rejected' WHERE id = ?",
      [req.params.id]
    );
    res.status(200).json({ message: 'Job rejected.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject job.' });
  }
});

module.exports = router;