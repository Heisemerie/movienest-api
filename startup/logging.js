const winston = require("winston");
require("winston-mongodb");

module.exports = function (uri) {
  // Add a file and console transport to the default logger
  winston.add(new winston.transports.File({ filename: "combined.log" }));
  winston.add(new winston.transports.MongoDB({ db: uri }));
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );
  winston.rejections.handle(
    new winston.transports.File({ filename: "unhandledRejections.log" })
  );
};
