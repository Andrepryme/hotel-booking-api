const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../../controllers/auth/auth.controller");

const {
  registerValidator,
  loginValidator,
  validate,
} = require("../../middlewares/validators/auth.validator");

const {
  authenticate,
  authorize
} = require("../../middlewares/auth.middleware");

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

router.get(
  "/protected",
  authenticate,
  (req, res) => {
    res.json({
      message: "You are logged in",
      user: req.user,
    });
  }
);

router.get(
  "/admin-only",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);


module.exports = router;