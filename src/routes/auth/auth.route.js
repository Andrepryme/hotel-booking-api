const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  refreshToken,
  checkAuth
} = require("../../controllers/auth/auth.controller");

const {
  registerValidator,
  loginValidator,
  validate,
} = require("../../middlewares/validators/auth.validator");

const {
  authenticate,
  lazyAuthenticate
} = require("../../middlewares/auth.middleware");

router.post(
  "/register",
  registerValidator,
  validate,
  register
);

router.post(
  "/login",
  lazyAuthenticate,
  loginValidator,
  validate,
  login
);

router.post(
  "/logout",
  lazyAuthenticate,
  logout
);

router.post(
  "/refresh",
  refreshToken
);

router.get(
  '/check',
  lazyAuthenticate,
  checkAuth
);

module.exports = router;