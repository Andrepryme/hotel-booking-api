const { v4: uuidv4 } = require("uuid");
const { hashThis, compareHash } = require("../../utils/hash");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../../utils/jwt");
const { createUser, findUserByEmail } = require("../../repositories/auth/auth.repository");
const {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  deleteAllUserRefreshTokens
} = require("../../repositories/auth/refreshtoken.repository");

const { getUserRoleName } = require("../../repositories/rbac.repository");
const AppError = require("../../utils/appError");

async function registerUser({ name, email, password }) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  const id = uuidv4();
  const passwordHash = await hashThis(password);
  return await createUser( id, name, email, passwordHash );
}

async function loginUser({ email, password }) {
  const findEmail = await findUserByEmail(email);
  if (!findEmail) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await compareHash(password, findEmail.password_hash);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const roleName = await getUserRoleName(findEmail.id);
  if (!roleName) {
    throw new AppError("Authorization check failed", 500);
  }
  
  const accessToken = generateAccessToken({ userId: findEmail.id });
  const refreshToken = generateRefreshToken({ userId: findEmail.id });

  // Hash the refresh token before storing it in the database
  const tokenHash = await hashThis(refreshToken);

  // Store the hashed refresh token in the database with an expiration date (e.g., 7 days)
  await createRefreshToken(
    uuidv4(),
    findEmail.id,
    tokenHash,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: findEmail.id,
      email: findEmail.email,
      role: roleName,
    },
  };
}

async function refreshTokenService(token) {
    if (!token) {
      throw new AppError("No refresh token", 401);
    }
    // Verify the refresh token
    const decodedToken = verifyRefreshToken(token);
    if (!decodedToken) {
      throw new AppError("Invalid refresh token", 401);
    }
    // Hash the refresh token to compare with the stored hash in the database
    const tokenHash = hashThis(token);

    const pool = require("../../config/database");
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      // Check if the hashed token exists in the database and is still valid
      const storedToken = await findRefreshToken(client, tokenHash);
      if (!storedToken) {
        throw new AppError("Invalid refresh token", 404);
      }
      if (storedToken.revoked) {
        await deleteAllUserRefreshTokens(decodedToken.userId);
        throw new AppError("Token reuse detected", 401);
      }

      // Delete the old refresh token to prevent reuse
      await revokeRefreshToken(client, tokenHash);

      // Issue new access token
      const newAccessToken = generateAccessToken({ userId: decodedToken.userId });
      const newRefreshToken = generateRefreshToken({ userId: decodedToken.userId });

      // Hash the new refresh token and store it in the database
      const newRefreshTokenHash = hashThis(newRefreshToken);
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await createRefreshToken(
        uuidv4(),
        decodedToken.userId,
        newRefreshTokenHash,
        newExpiresAt
      );

      await client.query("COMMIT");

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
}

async function deleteAllUserRefreshTokensService(refreshToken) {
    if (!refreshToken) {
      throw new AppError("No refresh token provided", 400);
    }
    const decodedToken = verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      throw new AppError("Invalid refresh token", 401);
    }
    await deleteAllUserRefreshTokens(decodedToken.userId);
}

module.exports = {
  registerUser,
  loginUser,
  refreshTokenService,
  deleteAllUserRefreshTokensService
};
