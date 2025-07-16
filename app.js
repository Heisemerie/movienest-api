const express = require("express");
const Joi = require("joi");

const app = express();

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


// Express "endpoint" event emitter
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
}); 