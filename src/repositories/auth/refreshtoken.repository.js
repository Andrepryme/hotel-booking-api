const pool = require("../../config/database");

async function createRefreshToken(id, userId, tokenHash, expiresAt) {
  const query = `
    INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
    VALUES ($1, $2, $3, $4)
  `;
  const values = [id, userId, tokenHash, expiresAt];
  await pool.query(query, values);
}

async function findRefreshToken(client, tokenHash) {
  const query = `
    SELECT * FROM refresh_tokens
    WHERE token_hash = $1 AND expires_at > NOW()
  `;
  const values = [tokenHash];
  const result = await client.query(query, values);
  return result.rows[0];
}

async function deleteAllUserRefreshTokens(userId) {
  const query = `
    DELETE FROM refresh_tokens
    WHERE user_id = $1
  `;
  const values = [userId];
  await pool.query(query, values);
}

async function revokeRefreshToken(client, tokenHash) {
  const query = `
    UPDATE refresh_tokens
    SET revoked = TRUE
    WHERE token_hash = $1
  `;
  const values = [tokenHash];
  await client.query(query, values);
}

module.exports = {
  createRefreshToken,
  findRefreshToken,
  deleteAllUserRefreshTokens,
  revokeRefreshToken
};