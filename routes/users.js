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

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const result = await user.save();

  res.send(result);
});

module.exports = router;
