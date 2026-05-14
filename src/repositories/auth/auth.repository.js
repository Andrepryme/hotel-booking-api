const pool  = require("../../config/database");

console.time("db");

await pool.query("SELECT NOW()");

console.timeEnd("db");

async function createUser( id, name, email, passwordHash ) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Create user
        const userResult = await client.query(
            `INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email`,
            [id, name, email, passwordHash]);
        const userId = userResult.rows[0].id;

        // Assign default role = "user"
        await client.query(
            `INSERT INTO user_roles (user_id, role_id) SELECT $1, id FROM roles WHERE name = 'user' `,
            [userId]
        );

        await client.query("COMMIT");

        return userResult.rows[0];

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

async function findUserByEmail(email) {
    const sql = `
        SELECT * FROM users WHERE email = $1
    `;
    const res = await pool.query(sql, [email]);
    return res.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
};