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

async function getAllInquiries(data) {
  const query = `
    SELECT i.apartment_id, i.name, i.email, i.message
    FROM inquiries as i
    JOIN apartments as a ON i.apartment_id = a.id
    WHERE a.created_by = $1
    ORDER BY i.created_at DESC
    LIMIT $2 OFFSET $3
  `;
  const res = await pool.query(query, [data.userId, data.limit, data.offset]);
  return res.rows;
}

module.exports = {
    createInquiry,
    getAllInquiries
}