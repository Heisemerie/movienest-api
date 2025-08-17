const { Customer } = require("../models/customer");
const { Genre } = require("../models/genre");
const { Movie } = require("../models/movie");
const { Rental } = require("../models/rental");
const { User } = require("../models/user");

class Repo {
  constructor(model) {
    this.model = model;
  }
  findAllSortByName = function () {
    return this.model.find().sort({ name: 1 }); // movies, customers, genres
  };
  findAllSortByDate = function () {
    return this.model.find().sort("-dateOut"); // rentals
  };

  findById = function (id) {
    return this.model.findById(id); // customers, genres, users, rentals, movies
  };
  findByEmail = function (email) {
    return this.model.findOne({ email }); // users, login
  };

  create = function (data) {
    return new this.model(data).save();
  };
  update = function (id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  };
  delete = function (id) {
    return this.model.findByIdAndDelete(id);
  };
}

const customerRepo = new Repo(Customer);
const genreRepo = new Repo(Genre);
const movieRepo = new Repo(Movie);
const rentalRepo = new Repo(Rental);
const userRepo = new Repo(User);

module.exports = { customerRepo, genreRepo, movieRepo, rentalRepo, userRepo };
