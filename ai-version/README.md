# Task CRUD API

A beginner-friendly REST API for managing tasks using **Express.js** and **SQLite** with the **better-sqlite3** library.

This project demonstrates how to build a simple CRUD (Create, Read, Update, Delete) API without using an ORM or asynchronous database libraries.

---

## Features

* Express.js REST API
* SQLite database using `better-sqlite3`
* Automatic database creation
* Automatic table creation
* Seeds exactly three sample tasks on the first run
* Full CRUD operations
* Parameterized SQL queries for security
* ES Modules
* Beginner-friendly code with comments

---

## Project Structure

```text
task-crud-api/
├── server.js
├── database.js
├── package.json
├── README.md
└── .gitignore
```

---

## Technologies Used

* JavaScript (ES Modules)
* Node.js
* Express.js
* SQLite
* better-sqlite3

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Navigate into the project

```bash
cd task-crud-api
```

### 3. Install dependencies

```bash
npm install
```

---

## Running the Application

Start the server:

```bash
npm start
```

For development (Node.js watch mode):

```bash
npm run dev
```

The server will start on:

```text
http://localhost:3000
```

---

## Database

When the application starts:

* `tasks.db` is created automatically if it does not exist.
* The `tasks` table is created automatically.
* Three sample tasks are inserted only if the table is empty.
* Seed data is never duplicated after restarting the server.

---

## API Endpoints

### 1. Get All Tasks

**GET**

```http
GET /tasks
```

Example response:

```json
[
  {
    "id": 1,
    "title": "Learn Express.js",
    "completed": false
  },
  {
    "id": 2,
    "title": "Build a REST API",
    "completed": false
  }
]
```

---

### 2. Get a Single Task

**GET**

```http
GET /tasks/:id
```

Example:

```http
GET /tasks/1
```

Success response:

```json
{
  "id": 1,
  "title": "Learn Express.js",
  "completed": false
}
```

If the task does not exist:

```json
{
  "message": "Task not found"
}
```

Status Code:

* **200 OK**
* **404 Not Found**

---

### 3. Create a Task

**POST**

```http
POST /tasks
```

Request body:

```json
{
  "title": "Complete assessment"
}
```

Success response:

```json
{
  "id": 4,
  "title": "Complete assessment",
  "completed": false
}
```

Status Code:

* **201 Created**
* **400 Bad Request** (invalid title)

---

### 4. Update a Task

**PUT**

```http
PUT /tasks/:id
```

Request body:

```json
{
  "title": "Learn SQLite",
  "completed": true
}
```

Success response:

```json
{
  "id": 1,
  "title": "Learn SQLite",
  "completed": true
}
```

Status Code:

* **200 OK**
* **400 Bad Request**
* **404 Not Found**

---

### 5. Delete a Task

**DELETE**

```http
DELETE /tasks/:id
```

Example:

```http
DELETE /tasks/1
```

Status Code:

* **204 No Content**
* **404 Not Found**

---

## HTTP Status Codes

| Status Code | Description                   |
| ----------- | ----------------------------- |
| 200         | Request successful            |
| 201         | Resource created              |
| 204         | Resource deleted successfully |
| 400         | Invalid request data          |
| 404         | Resource not found            |

---

## Testing the API

You can test the API using tools such as:

* Postman
* Thunder Client (VS Code)
* Insomnia
* curl

Example:

```bash
curl http://localhost:3000/tasks
```

---

## Sample Seed Data

The application inserts these tasks only when the database is empty:

| ID | Title                | Completed |
| -- | -------------------- | --------- |
| 1  | Learn Express.js     | false     |
| 2  | Build a REST API     | false     |
| 3  | Practice SQLite CRUD | true      |

---

## License

This project is licensed under the MIT License.
