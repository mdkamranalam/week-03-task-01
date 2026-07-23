// -----------------------------------------------------------------------------
// Import required modules
// -----------------------------------------------------------------------------

import express from "express";
import db from "./database.js";

// -----------------------------------------------------------------------------
// Create Express application
// -----------------------------------------------------------------------------

const app = express();

// Port number
const PORT = 3000;

// -----------------------------------------------------------------------------
// Middleware
// -----------------------------------------------------------------------------

// Parse incoming JSON request bodies
app.use(express.json());

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Convert the SQLite completed value (0 or 1)
 * into a JavaScript boolean.
 *
 * @param {Object} task
 * @returns {Object|null}
 */
function formatTask(task) {
  if (!task) return null;

  return {
    id: task.id,
    title: task.title,
    completed: Boolean(task.completed),
  };
}

/**
 * Validate a task title.
 *
 * Returns true if:
 * - title exists
 * - title is a string
 * - title isn't empty
 */
function isValidTitle(title) {
  return typeof title === "string" && title.trim().length > 0;
}

// -----------------------------------------------------------------------------
// GET /tasks
// Return every task
// -----------------------------------------------------------------------------

app.get("/tasks", (req, res) => {
  // Fetch every task
  const rows = db.prepare("SELECT * FROM tasks ORDER BY id").all();

  // Convert completed from integer to boolean
  const tasks = rows.map(formatTask);

  res.json(tasks);
});

// -----------------------------------------------------------------------------
// GET /tasks/:id
// Return a single task
// -----------------------------------------------------------------------------

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  // Find task using parameterized query
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

  // Task not found
  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json(formatTask(task));
});

// -----------------------------------------------------------------------------
// POST /tasks
// Create a new task
// -----------------------------------------------------------------------------

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  // Validate title
  if (!isValidTitle(title)) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  // Insert task
  const result = db
    .prepare(
      `
            INSERT INTO tasks (title)
            VALUES (?)
        `,
    )
    .run(title.trim());

  // Retrieve newly created task
  const newTask = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(formatTask(newTask));
});

// -----------------------------------------------------------------------------
// PUT /tasks/:id
// Update an existing task
// -----------------------------------------------------------------------------

app.put("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);
    const { title, completed } = req.body;

    // Check if the task exists
    const existingTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(id);

    if (!existingTask) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    // Validate title
    if (!isValidTitle(title)) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    // Validate completed
    if (typeof completed !== "boolean") {
        return res.status(400).json({
            message: "Completed must be a boolean"
        });
    }

    // Update the task
    db.prepare(`
        UPDATE tasks
        SET title = ?, completed = ?
        WHERE id = ?
    `).run(
        title.trim(),
        completed ? 1 : 0,
        id
    );

    // Retrieve the updated task
    const updatedTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(id);

    res.json(formatTask(updatedTask));
});

// -----------------------------------------------------------------------------
// DELETE /tasks/:id
// Delete a task
// -----------------------------------------------------------------------------

app.delete("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    // Check if task exists
    const existingTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(id);

    if (!existingTask) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    // Delete the task
    db.prepare("DELETE FROM tasks WHERE id = ?")
        .run(id);

    // Successfully deleted
    res.sendStatus(204);
});

// -----------------------------------------------------------------------------
// Default Route
// -----------------------------------------------------------------------------

app.get("/", (req, res) => {
    res.json({
        message: "Task Management API is running."
    });
});

// -----------------------------------------------------------------------------
// Start the server
// -----------------------------------------------------------------------------

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});