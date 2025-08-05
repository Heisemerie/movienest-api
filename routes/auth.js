const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

// Joi auth schema
const schema = Joi.object({
  email: Joi.string().email().min(5).max(255).required(),
  password: Joi.string().min(5).max(255).required(),
});

// Post auth in DB
router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Validate email (check user exists)
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  // Validate password (compare passwords)
  const validPassword = await bcrypt.compare(req.body.password, user.password); // compare plaintext and hashed password
  if (!validPassword) return res.status(400).send("Invalid email or password");

  // Before we return a response we need to create a new JWT
  const token = jwt.sign({ _id: user._id }, "jwtPrivateKey"); // pass payload & secret key
  res.send(token);
});

module.exports = router;
