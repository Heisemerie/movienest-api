const express = require("express");
const { schema } = require("../models/rental");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");
const rentalService = require("../services/rental.service");
const router = express.Router();

// Get all
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const rentals = await rentalService.getAll();

    res.send(rentals);
  })
);

// Get
router.get(
  "/:id",
  validateObjectId,
  asyncMiddleware(async (req, res) => {
    const rental = await rentalService.getById(req.params.id);
    if (!rental)
      return res.status(404).send("The rental with the given ID was not found");

    res.send(rental);
  })
);

// Post
router.post(
  "/",
  // auth,
  asyncMiddleware(async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { rental, err } = await rentalService.create(req.body);

    if (
      err &&
      ["Invalid customer", "Invalid movie", "Movie not in stock"].includes(
        err.message
      )
    )
      return res.status(400).send(err.message);

    if (err) return res.status(500).send(err.message || "Something Failed...");

    res.status(201).send(rental);
  })
);

module.exports = router;
