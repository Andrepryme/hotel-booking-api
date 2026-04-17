const { body, validationResult } = require("express-validator");

const apartmentValidator = [
  body("title")
  .notEmpty()
  .withMessage("Title is required"),

  body("price")
    .isNumeric()
    .withMessage("Price must be a number"),

  body("location")
    .notEmpty()
    .withMessage("Location is required"),

  body("bedrooms")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Bedrooms must be a positive number"),

  body("bathrooms")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Bathrooms must be a positive number"),

  body("has_pool")
    .optional()
    .isBoolean(),

  body("has_garage")
    .optional()
    .isBoolean(),
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
  apartmentValidator,
  validate,
};