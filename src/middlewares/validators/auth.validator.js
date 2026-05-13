const { body, validationResult } = require("express-validator");

const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  // body("confirmPassword")
  //   .custom((value, { req }) => value === req.body.password)
  //   .withMessage("Passwords do not match"),
];

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// Final middleware to handle errors
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
}

module.exports = {
  registerValidator,
  loginValidator,
  validate,
};