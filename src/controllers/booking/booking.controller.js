const {
 createBookingService,
 getBookingsService,
 updateBookingStatusService
} = require("../../services/booking/booking.service");


async function createBooking(req, res, next){
  try {

    const booking = await createBookingService(
      req.body,
      req.user
    );

 res.status(201).json(booking);
  } catch(err) {
    next(err);
  }
}


async function getBookings(req, res, next){
  try {
    const bookings = await getBookingsService();
    res.json(bookings);
  } catch(err) {
    next(err);
  }
}


async function updateStatus(req, res, next){
  try {
    const booking = await updateBookingStatusService(
      req.params.id,
      req.body.status
    );
    res.json(booking);
  }
  catch(err) {
    next(err);
  }
}

module.exports = {
  createBooking,
  getBookings,
  updateStatus
};