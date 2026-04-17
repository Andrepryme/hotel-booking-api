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
  if (!images.length) return;

  const values = [];
  const placeholders = [];

  images.forEach((img, i) => {
    const baseIndex = i * 3;

    placeholders.push(
      `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`
    );

    values.push(img.id, img.apartment_id, img.url);
  });

  const query = `
    INSERT INTO apartment_images (id, apartment_id, image_url)
    VALUES ${placeholders.join(",")}
  `;

  await pool.query(query, values);
}

// async function getApartments({ limit, offset, filters }) {
//   let baseQuery = `SELECT * FROM apartments WHERE 1=1`;
//   let values = [];
//   let index = 1;

//   if (filters.location) {
//     baseQuery += ` AND location ILIKE $${index++}`;
//     values.push(`%${filters.location}%`);
//   }

//   if (filters.minPrice) {
//     baseQuery += ` AND price >= $${index++}`;
//     values.push(filters.minPrice);
//   }

//   if (filters.maxPrice) {
//     baseQuery += ` AND price <= $${index++}`;
//     values.push(filters.maxPrice);
//   }

//   baseQuery += ` LIMIT $${index++} OFFSET $${index++}`;
//   values.push(limit, offset);

//   const res = await pool.query(baseQuery, values);
//   return res.rows;
// }

async function getApartments({ limit, offset, filters, sort }) {
  let values = [];
  let index = 1;

  let where = `WHERE 1=1`;

  // Filters
  if (filters.location) {
    where += ` AND a.location ILIKE $${index++}`;
    values.push(`%${filters.location}%`);
  }

  if (filters.minPrice) {
    where += ` AND a.price >= $${index++}`;
    values.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    where += ` AND a.price <= $${index++}`;
    values.push(filters.maxPrice);
  }

  if (filters.bedrooms) {
    where += ` AND a.bedrooms = $${index++}`;
    values.push(filters.bedrooms);
  }

  // Sorting
  let orderBy = `ORDER BY a.created_at DESC`;

  if (sort === "price_asc") {
    orderBy = `ORDER BY a.price ASC`;
  }

  if (sort === "price_desc") {
    orderBy = `ORDER BY a.price DESC`;
  }

  // Main query with JSON aggregation
  const query = `
    SELECT 
      a.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', ai.id,
            'url', ai.image_url
          )
        ) FILTER (WHERE ai.id IS NOT NULL),
        '[]'
      ) AS images
    FROM apartments a
    LEFT JOIN apartment_images ai 
      ON ai.apartment_id = a.id
    ${where}
    GROUP BY a.id
    ${orderBy}
    LIMIT $${index++} OFFSET $${index++}
  `;

  values.push(limit, offset);

  const res = await pool.query(query, values);

  return res.rows;
}

async function countApartments(filters) {
  let where = `WHERE 1=1`;
  let values = [];
  let index = 1;

  if (filters.location) {
    where += ` AND location ILIKE $${index++}`;
    values.push(`%${filters.location}%`);
  }

  const query = `
    SELECT COUNT(*) FROM apartments
    ${where}
  `;

  const res = await pool.query(query, values);

  return parseInt(res.rows[0].count);
}

// async function getApartmentById(id) {
//   const res = await pool.query(
//     "SELECT * FROM apartments WHERE id = $1",
//     [id]
//   );

//   return res.rows[0];
// }

async function getApartmentById(id) {
  const query = `
    SELECT 
      a.*,
      COALESCE(
        json_agg(
          json_build_object(
            'id', ai.id,
            'url', ai.image_url
          )
        ) FILTER (WHERE ai.id IS NOT NULL),
        '[]'
      ) AS images
    FROM apartments a
    LEFT JOIN apartment_images ai 
      ON ai.apartment_id = a.id
    WHERE a.id = $1
    GROUP BY a.id
  `;

  const res = await pool.query(query, [id]);

  return res.rows[0];
}

async function updateApartment(id, data) {
  const fields = [];
  const values = [];
  let index = 1;

  // Dynamically build query
  for (const key in data) {
    fields.push(`${key} = $${index++}`);
    values.push(data[key]);
  }

  if (!fields.length) return null;

  const query = `
    UPDATE apartments
    SET ${fields.join(", ")}, updated_at = NOW()
    WHERE id = $${index}
    RETURNING *
  `;

  values.push(id);

  const res = await pool.query(query, values);

  return res.rows[0];
}

async function getImagesByApartmentId(id) {
  const res = await pool.query(
    "SELECT * FROM apartment_images WHERE apartment_id = $1",
    [id]
  );

  return res.rows;
}

async function getImageById(id) {
  const res = await pool.query(
    "SELECT * FROM apartment_images WHERE id = $1",
    [id]
  );

  return res.rows[0];
}

async function addImages(images) {
  if (!images.length) return;

  const values = [];
  const placeholders = [];

  images.forEach((img, i) => {
    const baseIndex = i * 3;

    placeholders.push(
      `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`
    );

    values.push(img.id, img.apartment_id, img.url);
  });

  const query = `
    INSERT INTO apartment_images (id, apartment_id, image_url)
    VALUES ${placeholders.join(",")}
  `;

  await pool.query(query, values);
}

async function deleteImage(imageId) {
  const res = await pool.query(
    "DELETE FROM apartment_images WHERE id = $1 RETURNING *",
    [imageId]
  );

  return res.rows[0];
}

async function deleteApartment(id) {
  const res = await pool.query(
    "DELETE FROM apartments WHERE id = $1 RETURNING *",
    [id]
  );

  return res.rows[0];
}

module.exports = {
  createApartment,
  insertImages,
  getApartments,
  countApartments,
  getApartmentById,
  updateApartment,
  getImagesByApartmentId,
  getImageById,
  addImages,
  deleteImage,
  deleteApartment,
};