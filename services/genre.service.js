const GenreRepo = require("../repo/GenreRepo");

async function getAll() {
  return await GenreRepo.findAllSortedByName();
}

async function getById(id) {
  return await GenreRepo.findById(id);
}

async function create(data) {
  const genre = await GenreRepo.create({ name: data.name });

  return genre;
}

async function update(id, data) {
  const genre = await GenreRepo.update(id, { name: data.name });

  return genre;
}

async function remove(id) {
  const genre = await GenreRepo.delete(id);

  return genre;
}

module.exports = { getAll, getById, create, update, remove };
