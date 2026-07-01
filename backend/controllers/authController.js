const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const {
  findUserByEmail,
  createUser,
  createGraduateProfile,
  createEmployerProfile
} = require('../models/userModel');

// ─────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, password, role, university, degree,
          graduationYear, district, companyName, industry, location } = req.body;

  // 1. Required field validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Name, email, password and role are required.' });
  }

  if (!['graduate', 'employer'].includes(role)) {
    return res.status(400).json({ message: 'Role must be either graduate or employer.' });
  }

  if (role === 'employer' && !companyName) {
    return res.status(400).json({ message: 'Company name is required for employer registration.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  // 2. Duplicate email check
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Transaction — users insert + profile insert must both succeed or both fail
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const userId = await createUser({ name, email, hashedPassword, role }, connection);

    if (role === 'graduate') {
      await createGraduateProfile({ userId, university, degree, graduationYear, district }, connection);
    } else {
      await createEmployerProfile({ userId, companyName, industry, location }, connection);
    }

    await connection.commit();

    return res.status(201).json({
      message: 'Registration successful.',
      user: { id: userId, name, email, role }
    });

  } catch (err) {
    await connection.rollback();
    console.error('Register error:', err.message);
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  } finally {
    connection.release();
  }
};

// ─────────────────────────────────────────
// POST /api/auth/login  (Step 5 e ashbe)
// ─────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Required field check
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // 2. Find user by email
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // 3. Compare password with stored hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  // 4. Generate JWT token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // 5. Return token + user info (never return password)
  return res.status(200).json({
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
module.exports = { register, login };