const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { schema } = require("../models/user");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const userService = require("../services/user.service");

// Get user
router.get(
  "/me",
  auth,
  asyncMiddleware(async (req, res) => {
    const user = await userService.get(req.user._id);
    res.send(user);
  })
);

// Post user in DB (create account)
router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { prevUser, user, token } = await userService.create(req.body);
    if (prevUser) return res.status(400).send("This user already exists.");

    res
      .header("x-auth-token", token) // in our client app when we register a user we can read the header, store the jwt on the client (local storage) and send it in the requests to the server
      .send(user);
  })
);

module.exports = router;
