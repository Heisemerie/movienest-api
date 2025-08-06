const express = require("express");
const router = express.Router();
const { schema, Movie } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");

// Get All
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort({ name: 1 });
  res.send(movies);
});

// Get
router.get("/:id", async (req, res) => {
  const movie = Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");

  res.send(movie);
});

// Post
router.post("/", auth, async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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
});

// Update
router.put("/:id", auth, async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  const movie = Movie.findByIdAndDelete(req.params.id);
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found");

  res.send(movie);
});

module.exports = router;
