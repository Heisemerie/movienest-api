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


// Express "endpoint" event emitter
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
}); 