module.exports = function (jwtPrivateKey) {
  // Check that jwt is set
  if (!jwtPrivateKey) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined"); // throw error
  }
};
