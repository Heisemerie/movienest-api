require("dotenv").config(); // must come before `config` is used
const winston = require("winston");
const express = require("express");
const logging = require("./startup/logging");
const db = require("./startup/db");
const routes = require("./startup/routes");
const { configs, uri, port } = require("./startup/configs");
const prod = require("./startup/prod");

const app = express();

configs();
logging(uri);
db(uri);
prod(app);
routes(app);

// Only start server in development
if (!process.env.VERCEL) {
  const server = app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
    winston.info(`Swagger Docs available at http://localhost:${port}/api-docs`);
  });

  module.exports = server; // for integration tests
} else {
  module.exports = app; // for Vercel production
}
