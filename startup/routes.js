const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
const status = require("../routes/status");
const error = require("../middleware/error");
const { swaggerUi, swaggerSpec } = require("./swagger");
const express = require("express");

module.exports = function (app) {
  // Middleware
  app.use(express.json());

  // Routes
  app.use("/", status);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(error); // register after all middleware functions (called by async.js, handles express and mongodb request processing errors)
};
