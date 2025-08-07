const express = require("express");
const router = express.Router();
const { schema, Movie } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Get All
router.get("/", async (req, res, next) => {
  try {
    const movies = await Movie.find().sort({ name: 1 });
    res.send(movies);
  } catch (error) {
    next(error);
  }
});

// Get
router.get("/:id", async (req, res, next) => {
  try {
    const movie = Movie.findById(req.params.id);
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found");

    res.send(movie);
  } catch (error) {
    next(error);
  }
});

// Post
router.post("/", auth, async (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Fetch the genre by ID
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      }, // embed genre document with specific properties (ie _id & name)
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });

    const result = await movie.save();

    res.send(result);
  } catch (error) {
    next(error);
  }
});

// Update
router.put("/:id", auth, async (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Fetch the genre by ID
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      genre: { _id: genre._id, name: genre.name }, // embed genre in movie
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });

    if (!movie)
      return res.status(404).send("The movie with the given ID was not found");

    res.send(movie);
  } catch (error) {
    next(error);
  }
});

// Delete
router.delete("/:id", [auth, admin], async (req, res, next) => {
  try {
    const movie = Movie.findByIdAndDelete(req.params.id);
    if (!movie)
      return res.status(404).send("The movie with the given ID was not found");

    res.send(movie);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
