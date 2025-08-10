require("dotenv").config(); // must come before `config` is used
const config = require("config");
const winston = require("winston");
require("winston-mongodb");
const express = require("express");
const routes = require("./startup/routes");
const db = require('./startup/db')
const app = express();

const uri = config.get("db.URI");

routes(app);
db(uri)

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

// Express "endpoint" event emitter
const port = config.get("port"); // get port from config
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
