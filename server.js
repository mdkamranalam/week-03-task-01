import express from "express";
import db from "./database.js";

const PORT = 3000;
const app = express();

app.use(express.json());

/**
 * GET /
 */
app.get("/", (req, res) => {
  res.json({ message: "Task API is running." });
});

/**
 * GET /tasks - Return all tasks
 */
app.get("/tasks", (req, res) => {
  const { search } = req.query;

  try {
    let tasks;

    if (search) {
      tasks = db
        .prepare(`SELECT * FROM tasks WHERE title LIKE ?`)
        .all(`%${search}%`);
    } else {
      tasks = db.prepare(`SELECT * FROM tasks`).all();
    }

    const formattedTasks = tasks.map((task) => ({
      ...task,
      completed: Boolean(task.completed),
    }));

    res.status(200).json(formattedTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tasks." });
  }
});

/**
 * GET /tasks/:id - Return a specific task by ID
 */
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  try {
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    task.completed = Boolean(task.completed);

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the task." });
  }
});

/**
 * GET /stats - Return task statistics
 */
app.get("/stats", (req, res) => {
  try {
    const total = db.prepare(`SELECT COUNT(*) AS count FROM tasks`).get();
    const completed = db
      .prepare(`SELECT COUNT(*) AS count FROM tasks WHERE completed = 1`)
      .get();
    const pending = db
      .prepare(`SELECT COUNT(*) AS count FROM tasks WHERE completed = 0`)
      .get();

    res.status(200).json({
      totalTasks: total.count,
      completedTasks: completed.count,
      pendingTasks: pending.count,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve statistics." });
  }
});

/**
 * POST /tasks - Create a new task
 */
app.post("/tasks", (req, res) => {
  const { title, completed = false } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title is required." });
  }

  try {
    const result = db
      .prepare(
        `INSERT INTO tasks (title, completed)
                VALUES (?, ?)`,
      )
      .run(title, completed ? 1 : 0);

    const newTask = db
      .prepare(`SELECT * FROM tasks WHERE id = ?`)
      .get(result.lastInsertRowid);

    newTask.completed = Boolean(newTask.completed);

    res.status(200).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the task." });
  }
});
/**
 * PUT /tasks/:id - Update an existing task
 */
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, completed } = req.body;

  const existingTask = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);

  if (!existingTask) {
    return res.status(404).json({ error: "Task not found." });
  }

  const updatedTitle = title !== undefined ? title : existingTask.title;
  const updatedCompleted =
    completed !== undefined ? (completed ? 1 : 0) : existingTask.completed;

  try {
    db.prepare(
      `UPDATE tasks
            SET title = ?, completed = ?
            WHERE id = ?`,
    ).run(updatedTitle, updatedCompleted, id);

    const updatedTask = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);

    updatedTask.completed = Boolean(updatedTask.completed);

    res.status(200).json(updatedCompleted);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the task." });
  }
});

/**
 * DELETE /tasks/:id - Delete a task
 */
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const existingTask = db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);

  if (!existingTask) {
    return res.status(404).json({ error: "Task not found." });
  }

  try {
    db.prepare(`DELETE FROM tasks WHERE id = ?`).run(id);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the task." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
