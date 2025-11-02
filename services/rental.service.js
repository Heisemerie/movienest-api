const CustomerRepo = require("../repo/CustomerRepo");
const MovieRepo = require("../repo/MovieRepo");
const RentalRepo = require("../repo/RentalRepo");
const mongoose = require("mongoose");

async function getAll() {
  return await RentalRepo.findAllSortedByDate();
}

async function getById(id) {
  return await RentalRepo.findById(id);
}

async function create(data) {
  let rental;

  try {
    await mongoose.connection.transaction(async () => {
      const customer = await CustomerRepo.findById(data.customerId);
      if (!customer) throw new Error("Invalid customer");

      const movie = await MovieRepo.findById(data.movieId);
      if (!movie) throw new Error("Invalid movie");

      if (movie.numberInStock === 0) throw new Error("Movie not in stock");

      movie.numberInStock--; // decrement movie stock
      await movie.save();

      // create Rental
      rental = await RentalRepo.create({
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
    });

    return { rental };
  } catch (err) {
    return { err };
  }
}

module.exports = { getAll, getById, create };
