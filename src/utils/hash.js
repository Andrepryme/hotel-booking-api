const bcrypt = require("bcrypt");

async function hashThis(unhashed) {
  return bcrypt.hash(unhashed, 10);
}

async function compareHash(unhashed, hashed) {
  return bcrypt.compare(unhashed, hashed);
}

module.exports = {
  hashThis,
  compareHash,
};