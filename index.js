require("dotenv").config(); // must come before `config` is used
const config = require("config");
const winston = require("winston");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

// Load configs
const uri = config.get("db.URI");
const port = config.get("port");
const jwtPrivateKey = config.get("jwtPrivateKey");

// Startup modules
require("./startup/logging")(uri);
require("./startup/db")(uri);
require("./startup/routes")(app);
require("./startup/configs")(jwtPrivateKey);
require("./startup/prod")(app);

// Only start server in development
if (!process.env.VERCEL) {
  const server = app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
  });

  module.exports = server; // for integration tests, local dev
} else {
  module.exports = serverless(app); // for Vercel production
}
