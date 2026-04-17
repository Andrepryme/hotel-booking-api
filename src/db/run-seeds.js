const pool = require("../config/database");
const logger = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");
const { hashPassword } = require("../utils/hash");


const seedRoles = require("./seeds/roles.seed");
const seedPermissions = require("./seeds/permissions.seed");
const seedRolePermissions = require("./seeds/role_permissions.seed");
const seedUsers = require("./seeds/users.seed");
const seedApartments = require("./seeds/apartments.seed");


async function runSeed() {
  const client = await pool.connect();

  try {
    const seeded = await client.query(
        `SELECT 1 FROM seed_history WHERE name = 'initial_seed'`
    );
    if (seeded.rowCount > 0) {
        logger.logInfo("Database already seeded.");
        return;
    }
    // Start transaction
    await client.query("BEGIN");
    logger.logInfo("Seeding database...");

    // Seed role for RBAC
    await seedRoles(client);
    logger.logInfo("Roles created.");

    // Seed permissions for RBAC
    await seedPermissions(client);
    logger.logInfo("Permissions created");

    // Seed role permissions for RBAC
    await seedRolePermissions(client);
    logger.logInfo("Roles Permissions created");

    // Seed user
    const userId = uuidv4();
    const name = "John Doe";
    const email = "user@example.com";
    const password = await hashPassword("user123", 10);
    await seedUsers(client, userId, name, email, password);
    logger.logInfo("User permissions created.");
    
    // Seed apartments & their images
    await seedApartments(client, userId);
    logger.logInfo("Apartments + Images added.");
    
    // Log seed history
    await client.query(
      `INSERT INTO seed_history (name) VALUES ('initial_seed')`
    );
    
    await client.query("COMMIT");
    logger.logInfo("Seeding completed successfully");

  } catch (err) {
    await client.query("ROLLBACK");
    logger.logError(err);
  } finally {
    client.release();
  }
}

runSeed();