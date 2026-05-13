const { body, validationResult } = require("express-validator");

const bookingValidator = [
  body("check_in")
  .isDate()
  .withMessage("Check-in date is required"),

  body("check_out")
    .isDate()
    .withMessage("Check-out date is required"),

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
  bookingValidator,
  validate,
};