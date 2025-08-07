const express = require("express");
const router = express.Router();
const { schema, Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Get all genres in DB
router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
  } catch (error) {
    res.status(500).send("Something failed.");
  }
});

// Get genre
router.get("/:id", async (req, res) => {
  try {
    // Find genre in array, if does not exist, return 404
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    // Return the genre
    res.send(genre);
  } catch (error) {
    res.status(500).send("Something failed.");
  }
});

// Post genre
router.post("/", auth, async (req, res) => {
  try {
    // Validate request
    // If invalid, return 400
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Create genre and add to DB
    const genre = new Genre({ name: req.body.name });
    const result = await genre.save();

    // Return genre to client
    res.send(result);
  } catch (error) {
    res.status(500).send("Something failed.");
  }
});

// Update genre
router.put("/:id", auth, async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).send("Something failed.");
  }
});

// Delete genre
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    // Look up and delete the genre
    // If the genre does not exist, return 404 - Not found
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found");

    // Return the genre
    res.send(genre);
  } catch (error) {
    res.status(500).send("Something failed.");
  }
});

module.exports = router;
