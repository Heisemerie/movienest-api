require("dotenv").config(); // must come before `config` is used
const config = require("config");
const express = require("express");
const logging = require("./startup/logging");
const db = require('./startup/db');
const routes = require("./startup/routes");
const app = express();

const uri = config.get("db.URI");
const port = config.get("port"); 

logging(uri)
db(uri)
routes(app);

// Check that jwt is set
if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined"); // throw error
  process.exit(1); // exit the process (0 is success)
}

// Express "endpoint" event emitter
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
