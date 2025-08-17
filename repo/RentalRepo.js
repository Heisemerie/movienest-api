const { Rental } = require("../models/rental");
const {Repo} = require('./repo')

class RentalRepo extends Repo {
  constructor(model) {
    super(model);
  }

  findAllSortedByDate() {
    return this.findAll({}, { dateOut: -1 });
  }
}

const rentalRepo = new RentalRepo(Rental);
