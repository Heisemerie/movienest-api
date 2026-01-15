require("dotenv").config(); // must come before `config` is used
const winston = require("winston");
const express = require("express");
const logging = require("./startup/logging");
const db = require("./startup/db");
const routes = require("./startup/routes");
const { configs, uri, port, notVercel } = require("./startup/configs");
const prod = require("./startup/prod");

const app = express();

configs();
logging(uri);
db(uri);
prod(app);
routes(app);

if (notVercel) {
  const server = app.listen(port, () => {
    winston.info(`Listening on port ${port}...`);
    winston.info(`Swagger Docs available at http://localhost:${port}/api-docs`);
  });

  module.exports = server;
} else {
  module.exports = app;
}
