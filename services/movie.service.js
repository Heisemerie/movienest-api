const movieRepo = require("../repo/movie.repo");
const { Genre } = require("../models/genre");

async function getAll() {
  return movieRepo.findAll();
}

async function getById(id) {
  const movie = await movieRepo.findById(id);
  return movie;
}

async function create(data) {
  // Fetch the genre by ID
  const genre = await Genre.findById(data.genreId);
  if (!genre) return { genre };

  const movieData = {
    title: data.title,
    genre: { _id: genre._id, name: genre.name },
    numberInStock: data.numberInStock,
    dailyRentalRate: data.dailyRentalRate,
  };

  const movie = await movieRepo.create(movieData);

  return { movie, genre };
}

async function update(id, data) {
  // Fetch the genre by ID
  const genre = await Genre.findById(data.genreId);
  if (!genre) return { genre };

  const movieData = {
    title: data.title,
    genre: { _id: genre._id, name: genre.name },
    numberInStock: data.numberInStock,
    dailyRentalRate: data.dailyRentalRate,
  };

  const movie = await movieRepo.update(id, movieData);
  if (!movie) return { movie, genre };

  return { movie, genre };
}

async function remove(id) {
  const movie = await movieRepo.delete(id);
  return movie;
}

module.exports = { getAll, getById, create, update, remove };
