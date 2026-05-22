const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) {
      console.error("Invalid token:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Save decoded info (userID, roleID, etc.) for next middleware
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
