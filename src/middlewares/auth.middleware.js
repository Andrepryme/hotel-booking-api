const { verifyAccessToken } = require("../utils/jwt");
const AppError = require("../utils/appError");
const { cookie } = require("express-validator");

// This is for protected routes, it will check for access token and verify it. If valid, it will attach the user info to req.user and call next(). If invalid or expired, it will return 401 error.
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
    return next(new AppError("Authentication failed", 401));
  }
}

// This is for routes that can be accessed by both authenticated and unauthenticated users. It will check for access token and verify it. If valid, it will attach the user info to req.user. If invalid or expired, it will clear the cookies and call next() without error, allowing the route handler to decide how to handle unauthenticated users.
function lazyAuthenticate(req, res, next) {
  const token = req.cookies?.access_token;
  try {
    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        req.user = decoded;
      } else {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
      }
    }
    next();
  } catch (err) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    next(); 
  }
}

module.exports = {
  authenticate,
  lazyAuthenticate,
};