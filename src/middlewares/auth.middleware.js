const { verifyAccessToken } = require("../utils/jwt");
const AppError = require("../utils/appError");
const { logInfo } = require("../utils/logger");

// Authentication middleware
function authenticate(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) {
    return next(new AppError("Authentication failed", 401));
  }
  try {
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return next(new AppError("Authentication failed", 401));
    }

    req.user = decoded;
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Session expired, please login", 401));
    }

    return next(new AppError("Authentication failed", 401))
  }
}

module.exports = authenticate;