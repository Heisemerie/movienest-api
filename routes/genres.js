const express = require("express");
const router = express.Router();
const { schema } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");
const genreService = require("../services/genre.service");

// Get all genres in DB
router.get(
  "/", 
  asyncMiddleware(async (req, res) => {
    const genres = await genreService.getAll();

    res.send(genres);
  })
);

// Get genre
router.get(
  "/:id",
  validateObjectId,
  asyncMiddleware(async (req, res) => {
    const genre = await genreService.getById(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  })
);

// Post genre
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await genreService.create(req.body);

    res.send(genre);
  })
);

// Update genre
router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleware(async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await genreService.update(req.params.id, req.body);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found");

    res.send(genre);
  })
);

// Delete genre
router.delete(
  "/:id",
  [auth, admin, validateObjectId],
  asyncMiddleware(async (req, res) => {
    const genre = await genreService.remove(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found");

    res.send(genre);
  })
);

module.exports = router;
