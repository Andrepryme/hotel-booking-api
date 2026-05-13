const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
  refreshTokenService,
  deleteAllUserRefreshTokensService
} = require("../../services/auth/auth.service");

const { getRequestMeta } = require("../../utils/helper");

async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) { 
  if (req.user?.loggedIn === true) {
    return res.status(200).json({ message: "Already logged in" });
  }
  try {
    const { accessToken, refreshToken, user } = await loginUser(req.body, getRequestMeta(req));
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

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    if (req.user?.loggedIn === true) {
      await deleteAllUserRefreshTokensService(req.user.userId);
    }
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function refreshToken(req, res, next) {
  if (!req.cookies?.refresh_token) {
    return res.sendStatus(401);
  }
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
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function checkAuth(req, res, next) {
  try {
    if (req.user?.loggedIn === true) {
      return res.status(200).json({
        user: {
          id: req.user.userId,
          email: req.user.email,
          name: req.user.name,
          role: req.user.role,
          loggedIn: true
        }
      });
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  } 
}

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  checkAuth
};