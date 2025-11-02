const express = require("express");
const { schema } = require("../models/rental");
const returnService = require("../services/return.service");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { rental, err } = await returnService.create(req.body);

  if (err && ["Rental not found"].includes(err.message))
    return res.status(404).send(err.message);

  if (err && ["Return already processed"].includes(err.message))
    return res.status(400).send(err.message);

  return res.status(200).send(rental);
});

module.exports = router;
