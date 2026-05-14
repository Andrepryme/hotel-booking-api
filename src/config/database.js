const { Pool } = require("pg");
const { logInfo, logError } = require("../utils/logger");

// Import database configuration from environment variables
const {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD 
} = require("./env");

let pool;
// Create a new PostgreSQL connection pool
if  (process.env.DATABASE_URL) {
    // Production
    pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    });
} else {
    // Development
    pool = new Pool({
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD
    });
}

async function connectDB() {
  try {
    await pool.query("SELECT 1");
    logInfo("PostgreSQL connected");
  } catch (err) {
    logError("❌ DB connection failed", err);
    process.exit(1);
  }
}

connectDB();

module.exports = pool;