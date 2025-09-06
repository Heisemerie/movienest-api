const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function (uri) {
  // Connect to MongoDB replica set
  mongoose.connect(uri).then(() => winston.info(`Connected to ${uri}...`));
};
