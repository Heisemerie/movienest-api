const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { schema, User } = require("../models/user");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");

// Get user
router.get(
  "/me",
  auth,
  asyncMiddleware(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  })
);

// Post user in DB (create account)
router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user already exists
    const prevUser = await User.findOne({ email: req.body.email });
    if (prevUser) return res.status(400).send("This user already exists.");

    // Create new user
    let user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt); // hash the password
    const result = await user.save();

    const token = user.generateAuthToken(); // user is immediately logged in after registering
    res
      .header("x-auth-token", token) // in our client app when we register a user we can read the header, store the jwt on the client (local storage) and send it in the requests to the server
      .send(_.pick(result, ["_id", "name", "email"])); // do not return the password
  })
);

module.exports = router;
