const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const mongoose = require("mongoose");

const app = express();

// Connect to MongoDB replica set
mongoose
  .connect(
    "mongodb://localhost:27017,localhost:27018,localhost:27019/vidly?replicaSet=rs0"
  )
  .then(() => console.log("Connected to MongoDB replica set"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

// Routes
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

// Express "endpoint" event emitter
const port = process.env.PORT || 3000; // get port from environment variable or use port 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
