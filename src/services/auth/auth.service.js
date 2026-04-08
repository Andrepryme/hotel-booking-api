const { v4: uuidv4 } = require("uuid");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");
const { createUser, findUserByEmail } = require("../../repositories/auth/auth.repository");
const AppError = require("../../utils/appError");

async function registerUser({ name, email, password }) {
  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }
  // Generate unique ID and hash password
  const id = uuidv4();
  const passwordHash = await hashPassword(password);

  return await createUser({ id, name, email, passwordHash });
}

async function loginUser(email, password) {
  // Find user by email
  const findEmail = await findUserByEmail(email);
  if (!findEmail) {
    throw new AppError("Invalid credentials", 401);
  }
  // Compare password
  const isMatch = await comparePassword(password, findEmail.password_hash);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  // Generate JWT token
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