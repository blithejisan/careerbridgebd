const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);



// Test route - confirms server + DB are alive
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      message: 'CareerBridge BD API is running and DB is reachable.'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'API is running but DB connection failed.',
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});