const pool = require("../../config/database");

async function createBooking(data) {
  const query=`
   INSERT INTO bookings(id, apartment_id, user_id, check_in, check_out, status)
   VALUES($1, $2, $3, $4, $5, $6)
   RETURNING *;
  `;
  const values = [
    data.id,
    data.apartment_id,
    data.user_id,
    data.check_in,
    data.check_out,
    "pending"
  ];
  const result = await pool.query(query,values);
  return result.rows[0];
}

async function findOverlappingBookings(apartmentId, checkIn, checkOut) {
  const query=`
    SELECT * FROM bookings
    WHERE apartment_id = $1
    AND status != 'rejected'
    AND (
      (check_in <= $2 AND check_out >= $2)
      OR
      (check_in <= $3 AND check_out >= $3)
      OR
      (check_in >= $2 AND check_out <= $3)
    )
  `;
  const result = await pool.query(query, [apartmentId, checkIn, checkOut]);
  return result.rows;
}

async function getAllBookings() {
  const result = await pool.query(`SELECT * FROM bookings ORDER BY created_at DESC`);
  return result.rows;
}

async function updateBookingStatus(id, status) {
  const result = await pool.query(
    `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
}

module.exports = {
  createBooking,
  findOverlappingBookings,
  getAllBookings,
  updateBookingStatus
};