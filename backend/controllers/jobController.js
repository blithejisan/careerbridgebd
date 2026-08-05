const {
  getAllActiveJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} = require('../models/jobModel');

// GET /api/jobs — public
const getJobs = async (req, res) => {
  try {
    const { category, location, job_type } = req.query;
    const jobs = await getAllActiveJobs({ category, location, job_type });
    return res.status(200).json({ count: jobs.length, jobs });
  } catch (err) {
    console.error('getJobs error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch jobs.' });
  }
};

// GET /api/jobs/:id — public
const getJob = async (req, res) => {
  try {
    const job = await getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    return res.status(200).json({ job });
  } catch (err) {
    console.error('getJob error:', err.message);
    return res.status(500).json({ message: 'Failed to fetch job.' });
  }
};

// POST /api/jobs — employer only
const postJob = async (req, res) => {
  try {
    const { title, category, description, requirements,
            location, jobType, salaryRange, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Job title is required.' });
    }

    const jobId = await createJob({
      employerId: req.user.id,
      title, category, description, requirements,
      location, jobType, salaryRange, deadline
    });

    return res.status(201).json({
      message: 'Job posted successfully.',
      jobId
    });
  } catch (err) {
    console.error('postJob error:', err.message);
    return res.status(500).json({ message: 'Failed to post job.' });
  }
};

// PATCH /api/jobs/:id — employer only
const editJob = async (req, res) => {
  try {
    const affected = await updateJob(
      req.params.id,
      req.user.id,
      req.body
    );

    if (affected === 0) {
      return res.status(404).json({ message: 'Job not found or you are not authorized.' });
    }

    return res.status(200).json({ message: 'Job updated successfully.' });
  } catch (err) {
    console.error('editJob error:', err.message);
    return res.status(500).json({ message: 'Failed to update job.' });
  }
};

// DELETE /api/jobs/:id — employer only
const removeJob = async (req, res) => {
  try {
    const affected = await deleteJob(req.params.id, req.user.id);

    if (affected === 0) {
      return res.status(404).json({ message: 'Job not found or you are not authorized.' });
    }

    return res.status(200).json({ message: 'Job deleted successfully.' });
  } catch (err) {
    console.error('removeJob error:', err.message);
    return res.status(500).json({ message: 'Failed to delete job.' });
  }
};

module.exports = { getJobs, getJob, postJob, editJob, removeJob };