const moment = require("moment");
const express = require("express");
const { Rental, schema } = require("../models/rental");
const auth = require("../middleware/auth");
const { Movie } = require("../models/movie");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental) return res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed");

  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();

  const movie = await Movie.findById(rental.movie._id);
  movie.numberInStock++;
  await movie.save();

  return res.status(200).send(rental);
});

module.exports = router;
