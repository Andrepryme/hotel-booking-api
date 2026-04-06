CREATE TABLE inquiries (
    id UUID PRIMARY KEY,
    apartment_id UUID REFERENCES apartments(id),
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);