const config = require("config");

const uri = !process.env.VERCEL
  ? config.get("db.URI")
  : process.env.MONGODB_URI;
const jwtPrivateKey = !process.env.VERCEL
  ? config.get("jwtPrivateKey")
  : process.env.JWT_SECRET;
const port = !process.env.VERCEL ? config.get("port") : 3000;

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
