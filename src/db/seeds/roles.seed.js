async function seedRoles(client) {
  await client.query(`
    INSERT INTO roles (name, description)
    VALUES 
      ('user', 'Regular User'),
      ('admin', 'System Administrator')
    ON CONFLICT (name) DO NOTHING
  `);    
}

module.exports = seedRoles;