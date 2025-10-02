const genres = require("../routes/genres");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const login = require("../routes/login");
const returns = require("../routes/returns");
const error = require("../middleware/error");
const express = require("express");

module.exports = function (app) {
  // Middleware
  app.use(express.json());

  // Health check
  app.get("/", (req, res) => {
    res.send({ status: "MovieNest API running 🚀" });
  });

  // Routes
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/login", login);
  app.use("/api/returns", returns);
  app.use(error); // register after all middleware functions (called by async.js, handles express and mongodb request processing errors)
};
