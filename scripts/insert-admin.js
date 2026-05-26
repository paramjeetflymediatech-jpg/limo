/**
 * scripts/insert-admin.js
 *
 * Creates or updates an admin account directly in the MySQL database.
 *
 * Usage:
 *   node scripts/insert-admin.js <username> <password>
 *
 * Examples:
 *   node scripts/insert-admin.js admin admin123
 *   node scripts/insert-admin.js superuser MyStr0ngP@ss
 */

const mysql2 = require("mysql2/promise");
const crypto = require("crypto");
const path   = require("path");
const fs     = require("fs");

// ── Load .env manually (no dotenv dependency required) ──────────────────────
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key   = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

// ── Config ───────────────────────────────────────────────────────────────────
const DB_HOST     = process.env.DB_HOST     || "localhost";
const DB_PORT     = parseInt(process.env.DB_PORT || "3306");
const DB_USER     = process.env.DB_USER     || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME     = process.env.DB_NAME     || "limo";

function sha256(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

async function run() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error("");
    console.error("  Usage: node scripts/insert-admin.js <username> <password>");
    console.error("");
    console.error("  Examples:");
    console.error("    node scripts/insert-admin.js admin admin123");
    console.error("    node scripts/insert-admin.js superuser MyStr0ngP@ss");
    console.error("");
    process.exit(1);
  }

  const username     = args[0].trim().toLowerCase();
  const password     = args[1];
  const passwordHash = sha256(password);

  if (!username || !password) {
    console.error("Error: Username and password cannot be empty.");
    process.exit(1);
  }

  let connection;
  try {
    // ── Connect ────────────────────────────────────────────────────────────
    connection = await mysql2.createConnection({
      host:     DB_HOST,
      port:     DB_PORT,
      user:     DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    console.log(`\n  Connected to MySQL database "${DB_NAME}" on ${DB_HOST}:${DB_PORT}`);

    // ── Ensure table exists ────────────────────────────────────────────────
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        username     VARCHAR(255) PRIMARY KEY,
        passwordHash VARCHAR(255) NOT NULL
      )
    `);

    // ── Check if admin already exists ──────────────────────────────────────
    const [rows] = await connection.execute(
      "SELECT username FROM admins WHERE username = ?",
      [username]
    );

    if (rows.length > 0) {
      // Update existing admin
      await connection.execute(
        "UPDATE admins SET passwordHash = ? WHERE username = ?",
        [passwordHash, username]
      );
      console.log(`  ✔  Updated password for existing admin: "${username}"`);
    } else {
      // Insert new admin
      await connection.execute(
        "INSERT INTO admins (username, passwordHash) VALUES (?, ?)",
        [username, passwordHash]
      );
      console.log(`  ✔  Created new admin account: "${username}"`);
    }

    console.log(`  ✔  Password hash: ${passwordHash.slice(0, 12)}…`);
    console.log("\n  Done. You can now log in at /admin\n");
  } catch (err) {
    console.error("\n  ✗  Database error:", err.message);
    console.error("     Make sure MySQL is running and your .env is correct.\n");
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

run();
