const { v4: uuidv4 } = require("uuid");
const { hashPassword, comparePassword, hashToken } = require("../../utils/hash");
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

async function registerUser(user) {
  const existingUser = await findUserByEmail(user.email);
  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  const id = uuidv4();
  const passwordHash = await hashPassword(user.password);
  return await createUser( id, user.name, user.email, passwordHash );
}

async function loginUser(user, deviceInfo) {
  const findEmail = await findUserByEmail(user.email);
  if (!findEmail) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await comparePassword(user.password, findEmail.password_hash);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const roleName = await getUserRoleName(findEmail.id);
  if (!roleName) {
    throw new AppError("Authorization check failed", 500);
  }
  
  const accessToken = generateAccessToken({ userId: findEmail.id, name: findEmail.name, email: findEmail.email, role: roleName, loggedIn: true });
  const refreshToken = generateRefreshToken({ userId: findEmail.id });

  // Hash the refresh token before storing it in the database
  const tokenHash = await hashToken(refreshToken);

  // Store the hashed refresh token in the database with an expiration date (e.g., 7 days)
  await createRefreshToken(
    uuidv4(),
    findEmail.id,
    tokenHash,
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    deviceInfo.device_name,
    deviceInfo.ip_address,
    deviceInfo.user_agent
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
  // Verify the refresh token
  const decodedToken = verifyRefreshToken(token);
  if (!decodedToken) {
    throw new AppError("Authorization check failed", 401);
  }

  // Hash the refresh token to compare with the stored hash in the database
  const tokenHash = await hashToken(token);

  const pool = require("../../config/database");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    // Check if the hashed token exists in the database and is still valid
    const storedToken = await findRefreshToken(client, tokenHash);
    if (!storedToken) {
      throw new AppError("Authorization check failed", 401);
    }
    // If the token is found but marked as revoked, it indicates a possible token reuse attack
    if (storedToken.revoked) {
      console.log("TOKEN REUSE DETECTED", { userId: decodedToken.userId });
      // Invalidate all refresh tokens for the user to force logout from all sessions but for now just dlete all tokens for the user to prevent further abuse, in future we can implement a more sophisticated approach to only revoke tokens that are suspected of being compromised while allowing the user to maintain other active sessions.
      await deleteAllUserRefreshTokens(decodedToken.userId);
      throw new AppError("Authorization check failed", 401);
    }

    // Revoke the old refresh token to prevent reuse
    await revokeRefreshToken(client, tokenHash);
    
    // Get the user's role for the new access token
    const roleName = await getUserRoleName(decodedToken.userId);
    if (!roleName) {
      throw new AppError("Authorization check failed", 500);
    }

    // Issue new access token
    const newAccessToken = generateAccessToken({ userId: decodedToken.userId, name: decodedToken.name, email: decodedToken.email, role: roleName, loggedIn: true });
    const newRefreshToken = generateRefreshToken({ userId: decodedToken.userId });

    // Hash the new refresh token and store it in the database
    const newRefreshTokenHash = await hashToken(newRefreshToken);
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

async function deleteAllUserRefreshTokensService(userId) {
  await deleteAllUserRefreshTokens(userId);
}

module.exports = {
  registerUser,
  loginUser,
  refreshTokenService,
  deleteAllUserRefreshTokensService
};
