const { Genre } = require("../models/genre");
const Repo = require("./Repo");

class GenreRepo extends Repo {
  constructor(model) {
    super(model);
  }

  findAllSortedByName() {
    return this.findAll({}, { name: 1 });
  }
}

module.exports = new GenreRepo(Genre);
