async function seedPermissions(client) {
    await client.query(`
        INSERT INTO permissions (name, description)
        VALUES 
        ('create', 'Create'),
        ('read_own', 'Read own'),
        ('read_any', 'Read any'),
        ('update_own', 'Update own'),
        ('update_any', 'Update any'),
        ('delete_own', 'Delete own'),
        ('delete_any', 'Delete any')
        ON CONFLICT (name) DO NOTHING
    `);
}

module.exports = seedPermissions;