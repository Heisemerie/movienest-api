require('dotenv').config(); // must come before `config` is used
const config = require("config");
const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const mongoose = require("mongoose");

const app = express();

// Check that jwt is set
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined"); // throw error
  process.exit(1); // exit the process (0 is success)
}

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
app.use("/api/users", users);
app.use("/api/auth", auth);

// Express "endpoint" event emitter
const port = config.get("port"); // get port from config
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
