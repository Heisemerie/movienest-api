const express = require("express");
const router = express.Router();
const { schema, Genre } = require("../models/genre");
const auth = require("../middleware/auth");

// Get all genres in DB
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort({ name: 1 });
  res.send(genres);
});

// Get genre
router.get("/:id", async (req, res) => {
  // Find genre in array, if does not exist, return 404
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  // Return the genre
  res.send(genre);
});

// Post genre
router.post("/", auth, async (req, res) => {
  // Validate request
  // If invalid, return 400
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Create genre and add to DB
  const genre = new Genre({ name: req.body.name });
  const result = await genre.save();

  // Return genre to client
  res.send(result);
});

// Update genre
router.put("/:id", auth, async (req, res) => {
  // Validate
  // If invalid, return 400 - bad request
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Look up and update the genre in DB
  // If the genre does not exist, return 404 - Not found
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  // Return the updated genre
  res.send(genre);
});

// Delete genre
router.delete("/:id", auth, async (req, res) => {
  // Look up and delete the genre
  // If the genre does not exist, return 404 - Not found
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  // Return the genre
  res.send(genre);
});

module.exports = router;
