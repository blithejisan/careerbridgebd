const pool = require('../config/db');
const { sendStatusEmail } = require('../config/nodemailer');
const {
  createApplication,
  getApplicationsByGraduate,
  getApplicationsByJob,
  findApplication,
  updateApplicationStatus
} = require('../models/applicationModel');
const { getJobById } = require('../models/jobModel');

// POST /api/applications — graduate only
const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required.' });
    }

    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ message: 'This job is no longer accepting applications.' });
    }

    const existing = await findApplication(req.user.id, jobId);
    if (existing) {
      return res.status(409).json({ message: 'You have already applied for this job.' });
    }

    const applicationId = await createApplication({
      graduateId: req.user.id,
      jobId
    });

    return res.status(201).json({
      message: 'Application submitted successfully.',
      applicationId
    });
  } catch (err) {
    console.error('applyJob error:', err.message);
    return res.status(500).json({ message: 'Failed to submit application.' });
  }
};

// GET /api/applications/mine — graduate only
const myApplications = async (req, res) => {
  try {
    const applications = await getApplicationsByGraduate(req.user.id);
    return res.status(200).json({
      count: applications.length,
      applications
    });
  } catch (err) {
    console.error('myApplications error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch applications.' });
  }
};

// GET /api/applications/job/:jobId — employer only
const jobApplicants = async (req, res) => {
  try {
    const applications = await getApplicationsByJob(
      req.params.jobId,
      req.user.id
    );
    return res.status(200).json({
      count: applications.length,
      applications
    });
  } catch (err) {
    console.error('jobApplicants error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch applicants.' });
  }
};

// PATCH /api/applications/:id — employer only
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'shortlisted', 'rejected', 'hired'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const affected = await updateApplicationStatus(
      req.params.id,
      status,
      req.user.id
    );

    if (affected === 0) {
      return res.status(404).json({ message: 'Application not found or you are not authorized.' });
    }

    // Email notification
    try {
      const [rows] = await pool.query(
        `SELECT u.name, u.email, j.title
         FROM applications a
         JOIN users u ON a.graduate_id = u.id
         JOIN job_listings j ON a.job_id = j.id
         WHERE a.id = ?`,
        [req.params.id]
      );

      if (rows.length > 0) {
        await sendStatusEmail({
          toEmail: rows[0].email,
          graduateName: rows[0].name,
          jobTitle: rows[0].title,
          status,
        });
        console.log(`✅ Email sent to ${rows[0].email}`);
      }
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    return res.status(200).json({ message: `Application status updated to '${status}'.` });
  } catch (err) {
    console.error('updateStatus error:', err.message);
    return res.status(500).json({ message: 'Failed to update status.' });
  }
};

module.exports = { applyJob, myApplications, jobApplicants, updateStatus };