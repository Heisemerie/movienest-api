class Repo {
  constructor(model) {
    this.model = model;
  }

  // Find All
  findAll(filter = {}, sort = {}) {
    return this.model.find(filter).sort(sort);
  }

  // Find One
  findById = function (id) {
    return this.model.findById(id); // customers, genres, users, rentals, movies
  };

  // Create
  create = function (data) {
    return new this.model(data).save();
  };

  // Update
  update = function (id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  };

  // Delete
  delete = function (id) {
    return this.model.findByIdAndDelete(id);
  };
}

module.exports = { Repo };
