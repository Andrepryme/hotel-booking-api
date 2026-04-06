const { v4: uuidv4 } = require("uuid");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");
const { createUser, findUserByEmail } = require("../../repositories/auth/auth.repository");

async function registerUser({ name, email, password }) {
  const id = uuidv4();
  const passwordHash = await hashPassword(password);

  return await createUser({ id, name, email, passwordHash });
}

async function loginUser({ email, password }) {
  const findEmail = await findUserByEmail(email);

  if (findEmail.length === 0) {
    throw { status: 400, message: "Invalid credentials" };
  }

  const isMatch = await comparePassword(password, findEmail.password_hash);

  if (!isMatch) {
    throw { status: 400, message: "Invalid credentials" };
  }

  const token = generateToken({
    userId: findEmail.id,
    role: findEmail.role,
  });

  return {
    token,
    user: {
      id: findEmail.id,
      email: findEmail.email,
      role: findEmail.role,
    },
  };
}

module.exports = {
  registerUser,
  loginUser,
};