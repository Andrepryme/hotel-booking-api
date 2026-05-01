const pool = require("../../config/database");

async function createInquiry(data) {
  const query = `
    INSERT INTO inquiries (id, apartment_id, name, email, message)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    data.id,
    data.apartment_id,
    data.name,
    data.email,
    data.message,
  ];

  const res = await pool.query(query, values);
  return res.rows[0];
}

module.exports = {
    createInquiry,
}