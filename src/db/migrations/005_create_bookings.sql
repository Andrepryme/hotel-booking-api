CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    apartment_id UUID REFERENCES apartments(id),
    user_id UUID REFERENCES users(id),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);