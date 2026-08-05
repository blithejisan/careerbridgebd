const express = require('express');
const router = express.Router();
const { getJobs, getJob, postJob, editJob, removeJob } = require('../controllers/jobController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Employer only routes
router.post('/', protect, authorizeRoles('employer'), postJob);
router.patch('/:id', protect, authorizeRoles('employer'), editJob);
router.delete('/:id', protect, authorizeRoles('employer'), removeJob);

module.exports = router;