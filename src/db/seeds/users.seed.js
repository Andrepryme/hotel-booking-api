 async function seedUsers(client, id, name, email, password) {
    // Create User
    await client.query(
        `
        INSERT INTO users (id, name, email, password_hash)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
        `,
        [id, name, email, password]
    );

    // Make User an Admin
    await client.query(
        `INSERT INTO user_roles (user_id, role_id)
        SELECT u.id, r.id
        FROM users u, roles r
        WHERE u.email = $1
        AND r.name = 'admin'`,
        [email]
    );
}
module.exports = seedUsers;