const router = require("express").Router();

const {
  createInquiry,
  getAllInquiries
} = require("../../controllers/inquiry/inquiry.controller");

const { inquiryValidator, validate } = require("../../middlewares/validators/inquiry.validator");

const { authenticate } = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/rbac.middleware");

router.post(
  "/",
  inquiryValidator,
  validate,
  createInquiry
);

router.get(
  "/",
  authenticate,
  authorize(['read_own']),
  getAllInquiries
);

module.exports = router;