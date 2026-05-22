// verifyToken is a separate file (verifyToken.js) — keep as-is
// This file exports the isAdmin role guard used across admin routes

function isAdmin(req, res, next) {
  if (!req.user || req.user.roleID !== 666) {
    return res.status(403).json({ message: 'Forbidden: Admin only' });
  }
  next();
}

module.exports = { isAdmin };
