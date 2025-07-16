const express = require("express");
const Joi = require("joi");

const app = express();
const schema = Joi.object({ name: Joi.string().min(3).required() });

// Middleware
app.use(express.json());

const genres = [
  { id: 1, name: "horror" },
  { id: 2, name: "comedy" },
  { id: 3, name: "romance" },
  { id: 4, name: "action" },
  { id: 5, name: "thriller" },
];

// Routes
// Get all genres
app.get("/api/genres", (req, res) => {
  res.send(genres);
});

// Get genre
app.get("/api/genres/:id", (req, res) => {
  // Find genre in array, if does not exist, return 404
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  // Return the genre
  res.send(genre);
});

// Post genre
app.post("/api/genres", (req, res) => {
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

app.put("/api/genres/:id", (req, res) => {
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

// Express "endpoint" event emitter
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
