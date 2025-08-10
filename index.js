require("dotenv").config(); // must come before `config` is used
const config = require("config");
const express = require("express");
const app = express();

const uri = config.get("db.URI");
const port = config.get("port");
const jwtPrivateKey = config.get("jwtPrivateKey");

require("./startup/logging")(uri);
require("./startup/db")(uri);
require("./startup/routes")(app);
require("./startup/configs")(jwtPrivateKey);

// Express "endpoint" event emitter
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
