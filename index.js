require("dotenv").config(); // must come before `config` is used
const config = require("config");
const logging = require("./startup/logging");
const db = require("./startup/db");
const routes = require("./startup/routes");
const configs = require("./startup/configs");
const express = require("express");
const app = express();

const uri = config.get("db.URI");
const port = config.get("port");
const jwtPrivateKey = config.get("jwtPrivateKey") 

logging(uri);
db(uri);
routes(app);
configs(jwtPrivateKey)

// Express "endpoint" event emitter
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
