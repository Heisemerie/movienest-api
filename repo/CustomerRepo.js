const { Customer } = require("../models/customer");
const {Repo} = require('./repo')

class CustomerRepo extends Repo {
  constructor(model) {
    super(model);
  }

  findAllSortedByName() {
    return this.findAll({}, { name: 1 });
  }
}

const customerRepo = new CustomerRepo(Customer);
