const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const pool = require('../config/db');

// POST /api/users/upload-cv — graduate only
router.post('/upload-cv',
  protect,
  authorizeRoles('graduate'),
  upload.single('cv'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a PDF file.' });
      }

      const cvPath = `/uploads/${req.file.filename}`;

      await pool.query(
        'UPDATE graduate_profiles SET cv_path = ? WHERE user_id = ?',
        [cvPath, req.user.id]
      );

      return res.status(200).json({
        message: 'CV uploaded successfully.',
        cvPath,
      });
    } catch (err) {
      console.error('CV upload error:', err.message);
      return res.status(500).json({ message: 'Failed to upload CV.' });
    }
  }
);

// GET /api/users/profile — logged in user এর profile
router.get('/profile', protect, async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (req.user.role === 'graduate') {
      const [profile] = await pool.query(
        'SELECT * FROM graduate_profiles WHERE user_id = ?',
        [req.user.id]
      );
      return res.status(200).json({ user: users[0], profile: profile[0] });
    }

    if (req.user.role === 'employer') {
      const [profile] = await pool.query(
        'SELECT * FROM employer_profiles WHERE user_id = ?',
        [req.user.id]
      );
      return res.status(200).json({ user: users[0], profile: profile[0] });
    }

    return res.status(200).json({ user: users[0] });
  } catch (err) {
    console.error('Profile error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch profile.' });
  }
});

module.exports = router;