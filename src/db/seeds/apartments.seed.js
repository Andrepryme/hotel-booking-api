const { v4: uuidv4 } = require("uuid");

async function seedApartments(client, userId) {
    const apartment1Id = uuidv4();
    const apartment2Id = uuidv4();
    await client.query(
        `
        INSERT INTO apartments 
        (id, title, description, price, location, bedrooms, bathrooms, has_pool, has_garage, created_by)
        VALUES 
        ($1, 'Luxury Apartment', 'Sea view', 500000, 'Lekki', 3, 2, true, true, $3),
        ($2, 'Budget Apartment', 'Affordable', 150000, 'Yaba', 2, 1, false, false, $3)
        ON CONFLICT DO NOTHING
        `,
        [apartment1Id, apartment2Id, userId]
    );

    await client.query(
      `INSERT INTO apartment_images (id, apartment_id, image_url)
      VALUES
      ($1, $4, 'https://via.placeholder.com/300'),
      ($2, $4, 'https://via.placeholder.com/300'),
      ($3, $5, 'https://via.placeholder.com/300')
      ON CONFLICT DO NOTHING`,
      [uuidv4(), uuidv4(), uuidv4(), apartment1Id, apartment2Id]
    );
}

module.exports = seedApartments;