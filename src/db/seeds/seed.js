const pool = require("../database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");


async function seed() {
  const client = await pool.connect();

  try {
    console.log("Seeding database...");

    // Create Admin User
    const adminId = uuidv4();
    const passwordHash = await bcrypt.hash("admin123", 10);

    await client.query(
      `INSERT INTO users (id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      [adminId, "Admin User", "admin@example.com", passwordHash, "ADMIN"]
    );

    console.log("Admin user created.");

    // Create Sample Apartments
    const apartment1Id = uuidv4();
    const apartment2Id = uuidv4();

    await client.query(
      `INSERT INTO apartments 
       (id, title, description, price, location, bedrooms, bathrooms, has_pool, has_garage, created_by)
       VALUES 
       ($1, 'Luxury Apartment', 'Beautiful apartment with sea view', 500000, 'Lekki', 3, 2, true, true, $3),
       ($2, 'Budget Apartment', 'Affordable and comfortable', 150000, 'Yaba', 2, 1, false, false, $3)`,
      [apartment1Id, apartment2Id, adminId]
    );

    console.log("Apartments created.");

    // Add Images
    await client.query(
      `INSERT INTO apartment_images (id, apartment_id, image_url)
       VALUES
       ($1, $4, 'https://via.placeholder.com/300'),
       ($2, $4, 'https://via.placeholder.com/300'),
       ($3, $5, 'https://via.placeholder.com/300')`,
      [uuidv4(), uuidv4(), uuidv4(), apartment1Id, apartment2Id]
    );

    console.log("Images added.");

    console.log("Seeding complete.");
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
}

seed();