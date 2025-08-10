const winston = require("winston");
require("winston-mongodb");

module.exports = function (uri) {
  // Add a file, console and db transport to the default logger
  winston.add(new winston.transports.Console());
  winston.add(
    new winston.transports.File({ filename: "combined.log", level: "info" })
  );
  winston.add(
    new winston.transports.File({ filename: "error.log", level: "error" })
  );
  winston.add(new winston.transports.MongoDB({ db: uri, level: "error" }));

  // Add uncaught exception and rejection handlers to default logger
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    new winston.transports.Console()
  );
  winston.rejections.handle(
    new winston.transports.File({ filename: "unhandledRejections.log" }),
    new winston.transports.Console()
  );
};
