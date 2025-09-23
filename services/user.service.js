const UserRepo = require("../repo/UserRepo");
const _ = require("lodash");
const hashPassword = require("../utilities/hashPassword");

async function get(id) {
  const user = await UserRepo.findById(id);
  return _.pick(user, ["_id", "name", "email"]);
}

async function create(data) {
  // Check if user already exists
  const prevUser = await UserRepo.findByEmail(data.email);
  if (prevUser) return { prevUser };

  // Hash password & Create new user
  const user = await hashPassword(
    _.pick(data, ["name", "email", "password"])
  );

  const newUser = await UserRepo.create(user);

  // Log user in after registering
  const token = newUser.generateAuthToken();

  return { prevUser, user: _.pick(newUser, ["_id", "name", "email"]), token }; 
}

module.exports = { get, create };
