import Database from "better-sqlite3";

const db = new Database("tasks.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
    );
`);

const count = db.prepare("SELECT COUNT(*) AS total FROM tasks").get();

if (count.total === 0) {
  const insertTask = db.prepare(`
        INSERT INTO tasks (title, completed)
        VALUES (?, ?)
    `);

  insertTask.run("Learn Express", 0);
  insertTask.run("Build CRUD API", 0);
  insertTask.run("Practice SQLite", 1);

  console.log("Sample tasks inserted.");
}

export default db;
