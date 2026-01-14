const config = require("config");

const uri = process.env.MONGODB_URI || config.get("db.URI");
const jwtPrivateKey = process.env.JWT_SECRET || config.get("jwtPrivateKey");
const port = process.env.PORT || 3000 || config.get("port");

module.exports.configs = function configs() {
  if (!jwtPrivateKey) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
  }
  if (!uri) {
    throw new Error("FATAL ERROR: uri is not defined");
  }
  if (!port) {
    throw new Error("FATAL ERROR: port is not defined");
  }
};

module.exports.uri = uri;
module.exports.jwtPrivateKey = jwtPrivateKey;
module.exports.port = port;
