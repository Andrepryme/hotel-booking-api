const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  refreshToken
} = require("../../controllers/auth/auth.controller");

const {
  registerValidator,
  loginValidator,
  validate,
} = require("../../middlewares/validators/auth.validator");

router.post(
  "/register",
  registerValidator,
  validate,
  register
);

router.post(
  "/login",
  loginValidator,
  validate,
  login
);

router.post(
  "/logout",
  logout
);

router.post(
  "/refresh",
  refreshToken
);

module.exports = router;