const Joi = require("joi");
const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middleware/async");
const loginService = require("../services/login.service");

// Joi auth schema
const schema = Joi.object({
  email: Joi.string().email().min(5).max(255).required(),
  password: Joi.string().min(5).max(255).required(),
});

// Post auth in DB (login)
router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { user, validPassword, token } = loginService.create(req.body);

    if (!user) return res.status(400).send("Invalid email or password");

    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    res.send(token);
  })
);
// To log out a user, simply delete the token on the client (since it's not stored on the server)

module.exports = router;
