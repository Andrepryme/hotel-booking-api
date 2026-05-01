const { v4:uuidv4 } = require("uuid");
const AppError = require("../../utils/appError");

const {
 createBooking,
 findOverlappingBookings,
 getAllBookings,
 updateBookingStatus
} = require("../../repositories/booking/booking.repository");


async function createBookingService(data, user) {

  if (new Date(data.check_in) >= new Date(data.check_out)) {
    throw new AppError("Invalid date range", 400);
  }

  const overlaps = await findOverlappingBookings(
    data.apartment_id,
    data.check_in,
    data.check_out
  );

  if(overlaps.length) {
    throw new AppError("Apartment unavailable", 400);
  }

  return createBooking({
    id:uuidv4(),
    ...data,
    user_id:user.userId
  });
}


async function getBookingsService() {
 return getAllBookings();
}


async function updateBookingStatusService(id, status ){
  if (!["approved","rejected"].includes(status)){
    throw new AppError("Invalid status", 400);
  }
  return updateBookingStatus(id, status);
}

module.exports={
 createBookingService,
 getBookingsService,
 updateBookingStatusService
};