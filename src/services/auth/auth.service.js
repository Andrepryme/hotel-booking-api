const { pool } = require("../../db/database");
const { v4: uuidv4 } = require("uuid");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");

async function registerUser({ name, email, password }) {
  const id = uuidv4();
  const passwordHash = await hashPassword(password);

  const query = `
    INSERT INTO users (id, name, email, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, role
  `;

  const values = [id, name, email, passwordHash];

  const res = await pool.query(query, values);

  return res.rows[0];
}

async function loginUser({ email, password }) {
  const res = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (res.rows.length === 0) {
    throw { status: 400, message: "Invalid credentials" };
  }

  const user = res.rows[0];

  const isMatch = await comparePassword(password, user.password_hash);

  if (!isMatch) {
    throw { status: 400, message: "Invalid credentials" };
  }

  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = {
  registerUser,
  loginUser,
};