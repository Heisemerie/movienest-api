const express = require("express");
const { schema, Rental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const { default: mongoose } = require("mongoose");
const router = express.Router();

// Get all
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

// Get
router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res.status(404).send("The rental with the given ID was not found");

  res.send(rental);
});

// Post
router.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession(); // Starts a session object (holds context for transaction).

  try {
    await session.withTransaction(async () => {
      const customer = await Customer.findById(req.body.customerId).session(
        session
      );
      if (!customer) return res.status(400).send("Invalid customer");

      const movie = await Movie.findById(req.body.movieId).session(session);
      if (!movie) return res.status(400).send("Invalid movie");

      if (movie.numberInStock === 0)
        return res.status(400).send("Movie not in stock"); // check if the movie is in stock

      // create Rental (in memory)
      const rental = new Rental({
        customer: {
          _id: customer._id,
          name: customer.name,
          isGold: customer.isGold,
          phone: customer.phone,
        },
        movie: {
          _id: movie._id,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate,
        },
      });
      const result = await rental.save({ session });

      movie.numberInStock--; // decrement movie stock
      await movie.save({ session });

      res.send(result).status(201);
    });
  } catch (err) {
    res.status(500).send(err.message || "Something Failed...");
  } finally {
    await session.endSession();
  }
});

// Update
router.put("/:id", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // fetch new customer
      const newCustomer = await Customer.findById(req.body.customerId).session(
        session
      );
      if (!newCustomer) return res.status(400).send("Invalid customer");

      // fetch new movie
      const newMovie = await Movie.findById(req.body.movieId).session(session);
      if (!newMovie) return res.status(400).send("Invalid movie");

      if (newMovie.numberInStock === 0)
        return res.status(400).send("Movie not in stock"); // check if the new movie is in stock

      // fetch Rental
      const rental = await Rental.findById(req.params.id).session(session);

      // fetch previous movie using rental
      const prevMovie = await Movie.findById(rental.movie._id).session(session);
      if (prevMovie._id !== newMovie._id) prevMovie.numberInStock++; // increment previous movie if different from new movie
      await prevMovie.save({ session });

      // update the rental with newMovie and newCustomer (in memory)
      rental.set({
        customer: {
          _id: newCustomer._id,
          name: newCustomer.name,
          isGold: newCustomer.isGold,
          phone: newCustomer.phone,
        },
        movie: {
          _id: newMovie._id,
          title: newMovie.title,
          dailyRentalRate: newMovie.dailyRentalRate,
        },
      });
      const result = await rental.save({ session }); // save updated rental

      newMovie.numberInStock--; // decrement new movie stock
      await newMovie.save({ session });

      res.send(result).status(201);
    });
  } catch (err) {
    res.status(500).send(err.message || "Something Failed...");
  } finally {
    await session.endSession();
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);
  if (!rental)
    return res.status(404).send("The rental with the given ID was not found");

  res.send(rental);
});

module.exports = router;
