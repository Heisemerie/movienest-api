const mongoose = require("mongoose");
const winston = require("winston");

function db(uri) {
  // Connect to MongoDB replica set
  mongoose
    .connect(uri)
    .then(() => winston.info("Connected to MongoDB replica set"))
}

module.exports = db;
