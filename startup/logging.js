const winston = require("winston");
require("winston-mongodb");
const { notVercel } = require("./configs");

module.exports = function (uri) {
  // Add a file, console and db transport to the default logger
  winston.add(new winston.transports.Console());
  winston.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info",
    }),
  );
  winston.add(
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  );
  if (notVercel) {
    winston.add(new winston.transports.MongoDB({ db: uri, level: "error" }));
  }

  // Add uncaught exception and rejection handlers to default logger
  winston.exceptions.handle(
    new winston.transports.File({ filename: "logs/uncaughtExceptions.log" }),
    new winston.transports.Console(),
  );
  winston.rejections.handle(
    new winston.transports.File({ filename: "logs/unhandledRejections.log" }),
    new winston.transports.Console(),
  );
};
