const { User } = require("../models/user");
const Repo = require("./DbRepo");

class UserRepo extends Repo {
  constructor(model) {
    super(model);
  }

  findByEmail = function (email) {
    return this.model.findOne({ email }); // users, login
  };
}

module.exports = new Repo(User);
