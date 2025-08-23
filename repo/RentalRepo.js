const { Rental } = require("../models/rental");
const Repo = require("./Repo");

class RentalRepo extends Repo {
  constructor(model) {
    super(model);
  }

  findAllSortedByDate() {
    return this.findAll({}, { dateOut: -1 });
  }
}

module.exports = new RentalRepo(Rental);
