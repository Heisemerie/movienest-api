const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function (uri) {
  // Enable AsyncLocalStorage for transactions (must be set before connect)
  mongoose.set("transactionAsyncLocalStorage", true);

  // Connect to MongoDB replica set
  mongoose.connect(uri).then(() => winston.info(`Connected to ${uri}...`));
};
