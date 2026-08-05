const express = require('express');
const router = express.Router();
const { applyJob, myApplications, jobApplicants, updateStatus } = require('../controllers/applicationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Graduate only
router.post('/', protect, authorizeRoles('graduate'), applyJob);
router.get('/mine', protect, authorizeRoles('graduate'), myApplications);

// Employer only
router.get('/job/:jobId', protect, authorizeRoles('employer'), jobApplicants);
router.patch('/:id', protect, authorizeRoles('employer'), updateStatus);

module.exports = router;