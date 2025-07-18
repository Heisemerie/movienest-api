const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const mongoose = require("mongoose");

const app = express();

// Connect to DB
mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

// Middleware
app.use(express.json());

// Routes
app.use("/api/genres", genres);
app.use("/api/customers", customers);

// Express "endpoint" event emitter
const port = process.env.PORT || 3000; // get port from environment variable or use port 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
