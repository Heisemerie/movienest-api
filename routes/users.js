const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { schema, User } = require("../models/user");

// Post user in DB
router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user already exists
  const prevUser = await User.findOne({ email: req.body.email });
  if (prevUser) return res.status(400).send("This user already exists.");

  const user = new User(_.pick(req.body, ["name", "email", "password"]));
  const result = await user.save();

  res.send(_.pick(result, ["_id", "name", "email"])); // do not return the password
});

module.exports = router;
