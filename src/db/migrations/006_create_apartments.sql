CREATE TABLE IF NOT EXISTS apartments (
    id UUID PRIMARY KEY,

    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    location VARCHAR(255) NOT NULL,

    bedrooms INT DEFAULT 0 CHECK (bedrooms >= 0),
    bathrooms INT DEFAULT 0 CHECK (bathrooms >= 0),

    has_pool BOOLEAN DEFAULT FALSE,
    has_garage BOOLEAN DEFAULT FALSE,

    created_by UUID NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_apartments_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_apartments_location
ON apartments(location);

CREATE INDEX IF NOT EXISTS idx_apartments_price
ON apartments(price);

CREATE INDEX IF NOT EXISTS idx_apartments_created_by
ON apartments(created_by);