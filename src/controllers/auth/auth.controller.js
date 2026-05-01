const { path } = require("../../app");
const {
  registerUser,
  loginUser,
  refreshTokenService,
  deleteAllUserRefreshTokensService
} = require("../../services/auth/auth.service");

async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ user, message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { accessToken, refreshToken, user } = await loginUser(req.body);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ user, message: "Login successful" });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await deleteAllUserRefreshTokensService(req.cookies.refresh_token);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
}

async function refreshToken(req, res, next) {
  try {
    const { accessToken, refreshToken } = await refreshTokenService(req.cookies.refresh_token);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production when using HTTPS
      sameSite: "Lax", // Important for security, adjust as needed based on your frontend setup
      path: "/", // Ensure the cookie is sent with all requests to the API
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  logout,
  refreshToken
};