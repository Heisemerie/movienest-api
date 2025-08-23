const { Customer } = require("../models/customer");
const Repo = require("./Repo");

class CustomerRepo extends Repo {
  constructor(model) {
    super(model);
  }

  findAllSortedByName() {
    return this.findAll({}, { name: 1 });
  }
}

module.exports = new CustomerRepo(Customer);
