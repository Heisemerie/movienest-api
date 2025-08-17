const { User } = require("../models/user");
const {Repo} = require('./repo')

class UserRepo extends Repo {
  constructor(model) {
    super(model);
  }

  findByEmail = function (email) {
    return this.model.findOne({ email }); // users, login
  };
}

const userRepo = new Repo(User);
