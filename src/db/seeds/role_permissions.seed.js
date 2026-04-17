async function seedRolePermissions(client) {
    await client.query(`
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT r.id, p.id
        FROM roles r, permissions p
        WHERE r.name = 'user'
        AND p.name IN ('read_any')
        ON CONFLICT DO NOTHING
    `);

    await client.query(`
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT r.id, p.id
        FROM roles r, permissions p
        WHERE r.name = 'admin'
        ON CONFLICT DO NOTHING
    `);
}

module.exports = seedRolePermissions;