const { verifyToken } = require('../utils/jwt.util');

// Checks that a valid JWT was sent in the request.
// The token should be sent as: Authorization: Bearer <token>
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token); // { id, role, iat, exp }
    req.user = decoded; // attach user info to the request for later use
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Restricts a route to specific roles, e.g. requireRole('super_admin', 'librarian')
// Must be used AFTER requireAuth, since it relies on req.user being set.
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to do this' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
