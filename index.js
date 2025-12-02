require("dotenv").config(); // must come before `config` is used
const config = require("config");
const winston = require("winston");
const express = require("express");

const app = express();

// Load configs
const uri = process.env.MONGODB_URI || config.get("db.URI");
const jwtPrivateKey = process.env.JWT_SECRET || config.get("jwtPrivateKey");

// Startup modules
require("./startup/logging")(uri);
require("./startup/db")(uri);
require("./startup/routes")(app);
require("./startup/configs")(jwtPrivateKey);
require("./startup/prod")(app);

// Only start server in development
if (!process.env.VERCEL) {
  const port = config.get("port");

  const server = app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
    winston.info(`Swagger Docs available at http://localhost:3000/api-docs`);
  });

  module.exports = server; // for integration tests, local dev
} else {
  module.exports = app; // for Vercel production
}
