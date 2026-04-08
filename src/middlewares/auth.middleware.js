const { verifyToken } = require("../utils/jwt");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");

// Authentication middleware
function authenticate(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {

    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not authorized, no token", 401));
  }

  try {

    const decoded = verifyToken(token);
    if (!decoded) {
      logger.logInfo("Token verification failed");
      return next(new AppError("Authentication failed", 401));
    }

    req.user = decoded;
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      logger.logInfo("Session expired");
      return next(new AppError("Session expired, please login", 401));
    }

    logger.logError("AUTH ERROR", err);
    return next(new AppError("Authentication failed", 401))
  }
}

// RBAC middleware
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Not authorized", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Forbidden: insufficient permissions", 403)
      );
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};