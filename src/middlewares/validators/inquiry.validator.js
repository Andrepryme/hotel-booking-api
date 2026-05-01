const { body, validationResult } = require("express-validator");

const inquiryValidator = [
  body("name")
  .notEmpty()
  .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("message")
    .notEmpty()
    .withMessage("Message is required"),
];

function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      errors: errors.array(),
    });
  }

  next();
}

module.exports = {
  inquiryValidator,
  validate,
};