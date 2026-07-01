const pool = require('../config/db');

// Find a user by email - used for duplicate check & login
async function findUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

// Find a user by id - used by auth middleware later
async function findUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

// Insert into users table, returns the new user's id
async function createUser({ name, email, hashedPassword, role }, connection = pool) {
  const [result] = await connection.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role]
  );
  return result.insertId;
}

// Insert into graduate_profiles, linked to a users.id
async function createGraduateProfile({ userId, university, degree, graduationYear, district }, connection = pool) {
  await connection.query(
    `INSERT INTO graduate_profiles (user_id, university, degree, graduation_year, district)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, university || null, degree || null, graduationYear || null, district || null]
  );
}

// Insert into employer_profiles, linked to a users.id
async function createEmployerProfile({ userId, companyName, industry, location }, connection = pool) {
  await connection.query(
    `INSERT INTO employer_profiles (user_id, company_name, industry, location)
     VALUES (?, ?, ?, ?)`,
    [userId, companyName, industry || null, location || null]
  );
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  createGraduateProfile,
  createEmployerProfile
};