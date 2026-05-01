CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY,
  apartment_id UUID NOT NULL,
  user_id UUID NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_booking_apartment
        FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE,
CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_bookings_apartment_id ON bookings(apartment_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);