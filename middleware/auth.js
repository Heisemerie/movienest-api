const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const payload = jwt.verify(token, config.get("jwtPrivateKey")); // decode the token and extract the payload
    req.user = payload; // set the payload in the response
    next(); // call the next middleware function in the pipeline
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = auth;
