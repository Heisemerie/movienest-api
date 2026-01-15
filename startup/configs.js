const config = require("config");

const notVercel = !process.env.VERCEL;
const uri = notVercel ? config.get("db.URI") : process.env.MONGODB_URI;
const port = notVercel ? config.get("port") : 3000;
const jwtPrivateKey = notVercel
  ? config.get("jwtPrivateKey")
  : process.env.JWT_SECRET;

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
module.exports.notVercel = notVercel;
