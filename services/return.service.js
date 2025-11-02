const moment = require("moment");
const RentalRepo = require("../repo/RentalRepo");
const mongoose = require("mongoose");
const MovieRepo = require("../repo/MovieRepo");

async function create(data) {
  let rental;

  try {
    await mongoose.connection.transaction(async () => {
      // fetch the rental
      rental = await RentalRepo.findByParams({
        "customer._id": data.customerId,
        "movie._id": data.movieId,
      });

      if (!rental) throw new Error("Rental not found");

      if (rental.dateReturned) throw new Error("Return already processed");

      // set the return date and fee
      rental.dateReturned = new Date();
      const rentalDays = moment().diff(rental.dateOut, "days");
      rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
      await rental.save();

      // increment movie stock
      const movie = await MovieRepo.findById(rental.movie._id);
      movie.numberInStock++;
      await movie.save();
    });

    return { rental };
  } catch (err) {
    return { err };
  }
}

module.exports = { create };
