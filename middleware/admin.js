const jwt = require("jsonwebtoken");
const config = require("config");

// Assumed to run after authorization (auth) middleware function
function admin(req, res, next) {
  // 401 Unauthorized: when the user tries to access a protected resource but doesnt supply a valid jwt, we allow them retry
  // 403 Forbidden: user sends a valid web token but is still unauthorized, we do not allow retry

  if (!req.user.isAdmin) return res.status(403).send("Access denied.");

  next();
}

module.exports = admin;
