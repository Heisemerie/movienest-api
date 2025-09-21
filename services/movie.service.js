const MovieRepo = require("../repo/MovieRepo");
const GenreRepo = require("../repo/GenreRepo");

async function getAll() {
  return await MovieRepo.findAllSortedByTitle();
}

async function getById(id) {
  const movie = await MovieRepo.findById(id);
  return movie;
}

async function create(data) {
  // Fetch the genre by ID
  const genre = await GenreRepo.findById(data.genreId);
  if (!genre) return { genre };

  const movieData = {
    title: data.title,
    genre: { _id: genre._id, name: genre.name },
    numberInStock: data.numberInStock,
    dailyRentalRate: data.dailyRentalRate,
  };

  const movie = await MovieRepo.create(movieData);

  return { movie, genre };
}

async function update(id, data) {
  // Fetch the genre by ID
  const genre = await GenreRepo.findById(data.genreId);
  if (!genre) return { genre };

  const movieData = {
    title: data.title,
    genre: { _id: genre._id, name: genre.name },
    numberInStock: data.numberInStock,
    dailyRentalRate: data.dailyRentalRate,
  };

  const movie = await MovieRepo.update(id, movieData);
  if (!movie) return { movie, genre };

  return { movie, genre };
}

async function remove(id) {
  const movie = await MovieRepo.delete(id);
  return movie;
}

module.exports = { getAll, getById, create, update, remove };
