CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY,
    apartment_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inquiry_apartment
        FOREIGN KEY (apartment_id)
        REFERENCES apartments(id)
        ON DELETE CASCADE
);