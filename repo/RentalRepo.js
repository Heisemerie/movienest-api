const { Rental } = require("../models/rental");
const Repo = require("./DbRepo");

class RentalRepo extends Repo {
  constructor(model) {
    super(model);
  }

  findAllSortedByDate() {
    return this.findAll({}, { dateOut: -1 });
  }

  findByParams = function (params) {
    return this.model.findOne(params); // returns
  };
}

module.exports = new RentalRepo(Rental);
