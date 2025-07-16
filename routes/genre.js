const Joi = require("joi");
const express = require("express");
const router = express.Router();

const schema = Joi.object({ name: Joi.string().min(3).required() });

const genres = [
  { id: 1, name: "horror" },
  { id: 2, name: "comedy" },
  { id: 3, name: "romance" },
  { id: 4, name: "action" },
  { id: 5, name: "thriller" },
];

// Routes
// Get all genres
router.get("/", (req, res) => {
  res.send(genres);
});

// Get genre
router.get("/:id", (req, res) => {
  // Find genre in array, if does not exist, return 404
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  // Return the genre
  res.send(genre);
});

// Post genre
router.post("/", (req, res) => {
  // Validate request
  // If invalid, return 400
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Create genre and add to array
  const genre = { id: genres.length + 1, name: req.body.name };
  genres.push(genre);

  // Return genre to client
  res.send(genre);
});

router.put("/:id", (req, res) => {
  // Look up the genre
  // If the genre does not exist, return 404 - Not found
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  // Validate
  // If invalid, return 400 - bad request
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Update genre
  // Return the updated genre
  genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id", (req, res) => {
  // Look up the genre
  // If the genre does not exist, return 404 - Not found
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");

  // Delete the genre
  // Return the genre
  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

module.exports = router