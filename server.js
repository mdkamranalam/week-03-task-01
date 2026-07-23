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
  try {
    const tasks = db.prepare("SELECT * FROM tasks").all();
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
