const { verifyToken } = require("../utils/jwt");
const AppError = require("../utils/appError");

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
    return next(new AppError("Authentication failed", 401));
  }

  try {

    const decoded = verifyToken(token);
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