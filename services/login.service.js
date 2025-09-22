const UserRepo = require("../repo/UserRepo");
const bcrypt = require("bcrypt");

async function create(data) {
  // Validate email (check user exists)
  const user = await UserRepo.findByEmail(data.email);
  if (!user) return { user };

  // Validate password (compare passwords)
  const validPassword = await bcrypt.compare(data.password, user.password); // compare plaintext and hashed password
  if (!validPassword) return { user, validPassword };

  // Create and return a new JWT
  const token = user.generateAuthToken();

  return { user, validPassword, token };
}

module.exports = { create };
