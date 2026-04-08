const { verifyToken } = require("../utils/jwt");
const AppError = require("../utils/appError");

function authenticate(req, res, next) {
  let token;

  // Check if Authorization header exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // 2. Extract token
    token = req.headers.authorization.split(" ")[1];
  }

  // 3. If no token
  if (!token) {
    return next(new AppError("Not authorized, no token", 401));
  }

  try {
    // 4. Verify token
    const decoded = verifyToken(token);

    // 5. Attach user info to request
    req.user = decoded;

    next();
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
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