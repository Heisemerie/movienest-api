require("dotenv").config(); // must come before `config` is used
const winston = require("winston"); // comes with console transport
require("winston-mongodb");
const config = require("config");
const mongoose = require("mongoose");
const express = require("express");
const routes = require("./startup/routes");
const app = express();

routes(app);
const uri = config.get("db.URI");

// Add a file and console transport to the default logger
winston.add(new winston.transports.File({ filename: "combined.log" }));
winston.add(new winston.transports.MongoDB({ db: uri }));
winston.exceptions.handle(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);
winston.rejections.handle(
  new winston.transports.File({ filename: "unhandledRejections.log" })
);

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

// Express "endpoint" event emitter
const port = config.get("port"); // get port from config
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
