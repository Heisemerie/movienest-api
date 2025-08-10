const { Movie } = require("../models/movie");

module.exports = {
  findAll: () => Movie.find().sort({ name: 1 }),
  findById: (id) => Movie.findById(id),
  create: (data) => new Movie(data).save(),
  update: (id, data) => Movie.findByIdAndUpdate(id, data, { new: true }),
  delete: (id) => Movie.findByIdAndDelete(id),
};
