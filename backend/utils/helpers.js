const jwt = require("jsonwebtoken");

const getToken = async (userId) => {
  // Create the token using the provided userId and secret key.
  const token = jwt.sign({ userId }, process.env.SECRET_KEY);
  return token;
};

module.exports = getToken;
