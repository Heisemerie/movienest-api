require("dotenv").config(); // must come before `config` is used
const winston = require("winston"); // comes with console transport
require("winston-mongodb");
const config = require("config");
const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const mongoose = require("mongoose");
const error = require("./middleware/error");

const app = express();
const uri = config.get("db.URI");

process.on("uncaughtException", (err) => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(err.message, err);
}); // handles node.js process errors (outside express context)

// Add a file and console transport to the default logger
winston.add(new winston.transports.File({ filename: "combined.log" }));
winston.add(new winston.transports.MongoDB({ db: uri }));

// Check that jwt is set
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined"); // throw error
  process.exit(1); // exit the process (0 is success)
}

// Connect to MongoDB replica set
mongoose
  .connect(uri)
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
app.use(error); // register after all middleware functions (called by async.js, handles express and mongodb request processing errors)

// Express "endpoint" event emitter
const port = config.get("port"); // get port from config
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
