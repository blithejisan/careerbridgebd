const pool = require('../config/db');

// সব active jobs — public route এ use হবে
async function getAllActiveJobs({ category, location, job_type }) {
  let query = `SELECT j.*, u.name AS employer_name, e.company_name
               FROM job_listings j
               JOIN users u ON j.employer_id = u.id
               JOIN employer_profiles e ON j.employer_id = e.user_id
               WHERE j.status = 'active'`;

  const params = [];

  if (category) {
    query += ' AND j.category = ?';
    params.push(category);
  }
  if (location) {
    query += ' AND j.location LIKE ?';
    params.push(`%${location}%`);
  }
  if (job_type) {
    query += ' AND j.job_type = ?';
    params.push(job_type);
  }

  query += ' ORDER BY j.created_at DESC';

  const [rows] = await pool.query(query, params);
  return rows;
}

// Single job details
async function getJobById(id) {
  const [rows] = await pool.query(
    `SELECT j.*, u.name AS employer_name, e.company_name, e.industry, e.website
     FROM job_listings j
     JOIN users u ON j.employer_id = u.id
     JOIN employer_profiles e ON j.employer_id = e.user_id
     WHERE j.id = ?`,
    [id]
  );
  return rows[0] || null;
}

// Employer নতুন job post করবে
async function createJob({ employerId, title, category, description, requirements, location, jobType, salaryRange, deadline }) {
  const [result] = await pool.query(
    `INSERT INTO job_listings
     (employer_id, title, category, description, requirements, location, job_type, salary_range, deadline)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [employerId, title, category || null, description || null, requirements || null,
     location || null, jobType || null, salaryRange || null, deadline || null]
  );
  return result.insertId;
}

// Employer নিজের job update করবে
async function updateJob(id, employerId, fields) {
  const { title, category, description, requirements, location, jobType, salaryRange, deadline, status } = fields;
  const [result] = await pool.query(
    `UPDATE job_listings
     SET title = COALESCE(?, title),
         category = COALESCE(?, category),
         description = COALESCE(?, description),
         requirements = COALESCE(?, requirements),
         location = COALESCE(?, location),
         job_type = COALESCE(?, job_type),
         salary_range = COALESCE(?, salary_range),
         deadline = COALESCE(?, deadline),
         status = COALESCE(?, status)
     WHERE id = ? AND employer_id = ?`,
    [title, category, description, requirements, location,
     jobType, salaryRange, deadline, status, id, employerId]
  );
  return result.affectedRows;
}

// Employer নিজের job delete করবে
async function deleteJob(id, employerId) {
  const [result] = await pool.query(
    'DELETE FROM job_listings WHERE id = ? AND employer_id = ?',
    [id, employerId]
  );
  return result.affectedRows;
}

module.exports = {
  getAllActiveJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
};