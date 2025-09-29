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

async function update(id, data) {
  let rental;

  try {
    await mongoose.connection.transaction(async () => {
      const newCustomer = await CustomerRepo.findById(data.customerId);
      if (!newCustomer) throw new Error("Invalid customer");

      const newMovie = await MovieRepo.findById(data.movieId);
      if (!newMovie) throw new Error("Invalid movie");

      if (newMovie.numberInStock === 0) throw new Error("Movie not in stock");

      rental = await RentalRepo.findById(id);
      if (!rental)
        throw new Error("The rental with the given ID was not found");

      const prevMovie = await MovieRepo.findById(rental.movie._id); // fetch previous movie using rental

      if (prevMovie._id !== newMovie._id) {
        prevMovie.numberInStock++; // increment previous movie
        newMovie.numberInStock--; // decrement new movie stock
        await prevMovie.save();
        await newMovie.save();
      }

      rental = await RentalRepo.update(id, {
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
    });

    return { rental };
  } catch (err) {
    return { err };
  }
}

async function remove(id) {
  let rental;
  try {
    await mongoose.connection.transaction(async () => {
      rental = await RentalRepo.delete(id);
      if (!rental)
        throw new Error("The rental with the given ID was not found");

      const movie = await MovieRepo.findById(rental.movie._id);
      movie.numberInStock++;
      await movie.save();
    });
    return { rental };
  } catch (err) {
    return { err };
  }
}

module.exports = { getAll, getById, create, update, remove };
