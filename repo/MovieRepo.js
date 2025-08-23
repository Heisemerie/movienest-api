const { Movie } = require("../models/movie");
const Repo = require("./Repo");

class MovieRepo extends Repo {
  constructor(model) {
    super(model);
  }

  findAllSortedByTitle() {
    return this.findAll({}, { title: 1 });
  }
}

module.exports = new MovieRepo(Movie);
