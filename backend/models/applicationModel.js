const pool = require('../config/db');

// Graduate একটা job এ apply করবে
async function createApplication({ graduateId, jobId }) {
  const [result] = await pool.query(
    `INSERT INTO applications (graduate_id, job_id) VALUES (?, ?)`,
    [graduateId, jobId]
  );
  return result.insertId;
}

// Graduate নিজের সব applications দেখবে
async function getApplicationsByGraduate(graduateId) {
  const [rows] = await pool.query(
    `SELECT a.id, a.status, a.applied_at,
            j.title, j.location, j.job_type, j.deadline,
            e.company_name
     FROM applications a
     JOIN job_listings j ON a.job_id = j.id
     JOIN employer_profiles e ON j.employer_id = e.user_id
     WHERE a.graduate_id = ?
     ORDER BY a.applied_at DESC`,
    [graduateId]
  );
  return rows;
}

// Employer একটা job এর সব applicants দেখবে
async function getApplicationsByJob(jobId, employerId) {
  const [rows] = await pool.query(
    `SELECT a.id, a.status, a.applied_at,
            u.name AS graduate_name, u.email,
            g.university, g.degree, g.skills, g.cv_path
     FROM applications a
     JOIN users u ON a.graduate_id = u.id
     JOIN graduate_profiles g ON a.graduate_id = g.user_id
     JOIN job_listings j ON a.job_id = j.id
     WHERE a.job_id = ? AND j.employer_id = ?
     ORDER BY a.applied_at DESC`,
    [jobId, employerId]
  );
  return rows;
}

// Duplicate apply check
async function findApplication(graduateId, jobId) {
  const [rows] = await pool.query(
    `SELECT id FROM applications
     WHERE graduate_id = ? AND job_id = ? LIMIT 1`,
    [graduateId, jobId]
  );
  return rows[0] || null;
}

// Employer application status update করবে
async function updateApplicationStatus(id, status, employerId) {
  const [result] = await pool.query(
    `UPDATE applications a
     JOIN job_listings j ON a.job_id = j.id
     SET a.status = ?
     WHERE a.id = ? AND j.employer_id = ?`,
    [status, id, employerId]
  );
  return result.affectedRows;
}

module.exports = {
  createApplication,
  getApplicationsByGraduate,
  getApplicationsByJob,
  findApplication,
  updateApplicationStatus
};