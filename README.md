# week-02-task-01: Task CRUD API

A simple RESTful Task Management API built with **Node.js**, **Express.js**, and **SQLite**.

This project was completed as part of the Backend Internship Assessment.

---

## Features

- Create a task
- View all tasks
- View a single task
- Update a task
- Delete a task
- Persistent storage using SQLite

---

## Technologies Used

- Node.js
- Express.js
- SQLite
- better-sqlite3

---

## Project Structure

```
task-crud-api/
│
├── server.js
├── database.js
├── package.json
├── README.md
├── .gitignore
└── tasks.db
```

---

## Installation

Clone the repository.

```bash
git clone <repository-url>
```

Move into the project.

```bash
cd task-crud-api
```

Install dependencies.

```bash
npm install
```

Run the project.

```bash
npm start
```

The server starts on:

```
http://localhost:3000
```

---

## API Endpoints

### Get all tasks

```
GET /tasks
```

### Get task by ID

```
GET /tasks/:id
```

### Create task

```
POST /tasks
```

Example body:

```json
{
    "title": "Learn SQLite",
    "completed": false
}
```

### Update task

```
PUT /tasks/:id
```

Example body:

```json
{
    "title": "Master SQLite",
    "completed": true
}
```

### Delete task

```
DELETE /tasks/:id
```

---

## SQLite Database

The application automatically creates a SQLite database named:

```
tasks.db
```

It also creates the `tasks` table and inserts three sample tasks the first time the application runs.

---

## Database Screenshot

Insert your DB Browser screenshot here.

Example:

```
docs/database-screenshot.png
```

or

```markdown
![SQLite Database](docs/database-screenshot.png)
```

---

## SQL Queries Used

Retrieve all tasks.

```sql
SELECT * FROM tasks;
```

Retrieve one task.

```sql
SELECT * FROM tasks WHERE id = ?;
```

Insert task.

```sql
INSERT INTO tasks(title, completed)
VALUES (?, ?);
```

Update task.

```sql
UPDATE tasks
SET title = ?, completed = ?
WHERE id = ?;
```

Delete task.

```sql
DELETE FROM tasks
WHERE id = ?;
```

---

## Author

Md. Kamran Alam