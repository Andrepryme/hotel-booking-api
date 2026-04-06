CREATE TABLE apartments (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    price NUMERIC,
    location VARCHAR(255),
    bedrooms INT,
    bathrooms INT,
    has_pool BOOLEAN DEFAULT FALSE,
    has_garage BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);