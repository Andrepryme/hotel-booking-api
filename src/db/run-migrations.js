// Import the file system
const fs = require("fs");
// Path handles file path safely accross Oses
const path = require("path");
// Database connection
const pool = require("../config/database");

async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    console.log("Running migrations...");

    // Ensure migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        run_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const res = await client.query("SELECT name FROM migrations");
    const executed = res.rows.map((row) => row.name);

    const files = fs
      .readdirSync(path.join(__dirname, "migrations"))
      .sort();

    for (const file of files) {
      if (!executed.includes(file)) {
        console.log(`Running: ${file}`);

        const sql = fs.readFileSync(
          path.join(__dirname, "migrations", file),
          "utf-8"
        );

        await client.query(sql);
        await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
      }
    }

    await client.query("COMMIT");
    console.log("Migrations complete.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
  } finally {
    client.release();
  }
}

runMigrations();