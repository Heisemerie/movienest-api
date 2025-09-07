const express = require("express");
const router = express.Router();
const { schema } = require("../models/movie");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const movieService = require("../services/movie.service");
const validateObjectId = require("../middleware/validateObjectId");

// Get All
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const movies = await movieService.getAll();
    res.send(movies);
  })
);

// Get
router.get(
  "/:id",
  validateObjectId,
  asyncMiddleware(async (req, res) => {
    const movie = await movieService.getById(req.params.id);

    if (!movie)
      return res.status(404).send("The movie with the given ID was not found");

    res.send(movie);
  })
);

// Post
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { movie, genre } = await movieService.create(req.body);

    if (!genre) return res.status(400).send("Invalid genre");

    res.send(movie);
  })
);

// Update
router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleware(async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { movie, genre } = await movieService.update(req.params.id, req.body);

    if (!genre) return res.status(400).send("Invalid genre.");
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found");

    res.send(movie);
  })
);

// Delete
router.delete(
  "/:id",
  [auth, admin, validateObjectId],
  asyncMiddleware(async (req, res) => {
    const movie = await movieService.remove(req.params.id);

    if (!movie)
      return res.status(404).send("The movie with the given ID was not found");

    res.send(movie);
  })
);

module.exports = router;
