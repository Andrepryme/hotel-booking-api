const router = require("express").Router();
const { authenticate } = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/rbac.middleware");
const {
    createBooking,
    getBookings,
    updateStatus
} = require("../../controllers/booking/booking.controller");

const {
  bookingValidator,
  validate,
} = require("../../middlewares/validators/booking.validator");


router.post(
    "/",
    authenticate,
    bookingValidator,
    validate,
    createBooking
);

router.get(
    "/",
    authenticate,
    authorize(['read_own']),
    getBookings
);

router.patch(
    "/:id/status",
    authenticate,
    authorize(['update_own']),
    updateStatus
);

module.exports = router;