CREATE TABLE IF NOT EXISTS apartment_images (
    id UUID PRIMARY KEY,
    apartment_id UUID NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_images_apartment
        FOREIGN KEY (apartment_id)
        REFERENCES apartments(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_apartment_images_apartment_id
ON apartment_images(apartment_id);