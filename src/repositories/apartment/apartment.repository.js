const pool = require("../../config/database");

async function createApartment(data) {
  const query = `
    INSERT INTO apartments 
    (id, title, description, price, location, bedrooms, bathrooms, has_pool, has_garage, created_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *
  `;

  const values = [
    data.id,
    data.title,
    data.description,
    data.price,
    data.location,
    data.bedrooms,
    data.bathrooms,
    data.has_pool,
    data.has_garage,
    data.created_by,
  ];

  const res = await pool.query(query, values);
  return res.rows[0];
}

async function insertImages(images) {
  const query = `
    INSERT INTO apartment_images (id, apartment_id, image_url)
    VALUES ($1, $2, $3)
  `;

  for (const img of images) {
    await pool.query(query, [img.id, img.apartment_id, img.url]);
  }
}

async function getApartments({ limit, offset, filters }) {
  let baseQuery = `SELECT * FROM apartments WHERE 1=1`;
  let values = [];
  let index = 1;

  if (filters.location) {
    baseQuery += ` AND location ILIKE $${index++}`;
    values.push(`%${filters.location}%`);
  }

  if (filters.minPrice) {
    baseQuery += ` AND price >= $${index++}`;
    values.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    baseQuery += ` AND price <= $${index++}`;
    values.push(filters.maxPrice);
  }

  baseQuery += ` LIMIT $${index++} OFFSET $${index++}`;
  values.push(limit, offset);

  const res = await pool.query(baseQuery, values);
  return res.rows;
}

async function getApartmentById(id) {
  const res = await pool.query(
    "SELECT * FROM apartments WHERE id = $1",
    [id]
  );

  return res.rows[0];
}

module.exports = {
  createApartment,
  insertImages,
  getApartments,
  getApartmentById,
};