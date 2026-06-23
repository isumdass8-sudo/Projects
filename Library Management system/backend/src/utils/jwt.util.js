const jwt = require('jsonwebtoken');

// Create a JWT containing the user's id and role.
// This token is given to the user after login, and they send it back
// with future requests to prove who they are.
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

// Verify a token and return its decoded contents (id, role).
// Throws an error if the token is invalid or expired.
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
