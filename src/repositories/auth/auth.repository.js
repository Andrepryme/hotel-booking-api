const { pool } = require("../../db/database");

async function createUser({ id, name, email, passwordHash }) {
  const query = `
    INSERT INTO users (id, name, email, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, role
  `;
  const values = [id, name, email, passwordHash];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function findUserByEmail(email) {
    const query = `
        SELECT * FROM users WHERE email = $1
    `;
    const res = await pool.query(query,  [email]);
    return res.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
};