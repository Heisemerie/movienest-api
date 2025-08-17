const { Genre } = require("../models/genre");
const { Repo } = require("./repo");

class GenreRepo extends Repo {
  constructor(model) {
    super(model);
  }

  findAllSortedByName() {
    return this.findAll({}, { name: 1 });
  }
}

const genreRepo = new GenreRepo(Genre);
