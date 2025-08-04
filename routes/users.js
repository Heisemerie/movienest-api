const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { schema, User } = require("../models/user");

// Get All
router.get("/", async (req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.send(users);
});

// Post user in DB
router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user already exists
  const prevUser = await User.findOne({ email: req.body.email });
  if (prevUser) return res.status(400).send("This user already exists.");

  let user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt); // hash the password
  const result = await user.save();

  res.send(_.pick(result, ["_id", "name", "email"])); // do not return the password
});

module.exports = router;
