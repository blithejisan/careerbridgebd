const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // 1. Token আছে কিনা check
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // 2. "Bearer <token>" থেকে শুধু token অংশ নাও
  const token = authHeader.split(' ')[1];

  // 3. Token verify করো
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { protect };