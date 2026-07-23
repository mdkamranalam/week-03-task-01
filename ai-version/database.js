// Import the better-sqlite3 library
import Database from "better-sqlite3";

// Create (or open) the SQLite database.
// If tasks.db does not exist, it will be created automatically.
const db = new Database("tasks.db");

// Enable foreign key support.
// (Good practice even though this project doesn't use foreign keys.)
db.pragma("foreign_keys = ON");

/*
|--------------------------------------------------------------------------
| Create the tasks table
|--------------------------------------------------------------------------
|
| This statement runs every time the application starts.
| The table is only created if it does not already exist.
|
*/

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
    );
`);

/*
|--------------------------------------------------------------------------
| Seed sample data
|--------------------------------------------------------------------------
|
| Seed the database ONLY if the table is empty.
| This prevents duplicate records after restarting the server.
|
*/

// Check how many rows exist
const taskCount = db.prepare("SELECT COUNT(*) AS count FROM tasks").get();

// Seed only when empty
if (taskCount.count === 0) {
  // Prepare the insert statement once
  const insertTask = db.prepare(`
        INSERT INTO tasks (title, completed)
        VALUES (?, ?)
    `);

  // Insert exactly three sample tasks
  insertTask.run("Learn Express.js", 0);
  insertTask.run("Build a REST API", 0);
  insertTask.run("Practice SQLite CRUD", 1);

  console.log("Sample tasks inserted.");
}

// Export the database connection
export default db;
