const bcrypt = require("bcrypt");

async function hashPassword(user) {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  return user;
}

module.exports = hashPassword;
