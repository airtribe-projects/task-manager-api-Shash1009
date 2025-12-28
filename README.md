# Task Manager API

A RESTful API for managing tasks built with Node.js and Express.js. This API provides CRUD (Create, Read, Update, Delete) operations for task management with in-memory data storage, filtering, sorting, and priority management.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Filter tasks by completion status
- ✅ Sort tasks by creation date (newest/oldest)
- ✅ Priority management (low, medium, high)
- ✅ Input validation and error handling
- ✅ In-memory data storage (initialized from `task.json`)

## Prerequisites

- Node.js version 18.0.0 or higher
- npm (Node Package Manager)

## Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

## Running the Server

Start the server:
```bash
node app.js
```

The server will start on port 3000. You should see:
```
Server is listening on 3000
```

## API Endpoints

### Base URL
```
http://localhost:3000
```

## Task Schema

Each task has the following structure:
```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "priority": "medium",
  "createdAt": "2025-12-28T16:30:59.889Z"
}
```

**Fields:**
- `id` (number): Unique identifier (auto-generated)
- `title` (string): Task title (required, non-empty)
- `description` (string): Task description (required, non-empty)
- `completed` (boolean): Completion status (required)
- `priority` (string): Priority level - "low", "medium", or "high" (optional, defaults to "medium")
- `createdAt` (string): ISO timestamp of creation (auto-generated)

---

### 1. Get All Tasks

Retrieve a list of all tasks with optional filtering and sorting.

**Endpoint:** `GET /tasks`

**Query Parameters (optional):**
- `completed` (boolean): Filter by completion status (`true` or `false`)
- `sort` (string): Sort order - `"oldest"` for oldest first, default is newest first

**Examples:**
```bash
# Get all tasks (newest first)
GET /tasks

# Get only completed tasks
GET /tasks?completed=true

# Get only incomplete tasks
GET /tasks?completed=false

# Get all tasks sorted oldest first
GET /tasks?sort=oldest

# Get incomplete tasks sorted oldest first
GET /tasks?completed=false&sort=oldest
```

**Response:**
- **Status Code:** 200 OK
- **Body:** Array of task objects
```json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "medium",
    "createdAt": "2025-12-28T16:30:59.889Z"
  },
  ...
]
```

---

### 2. Get Tasks by Priority

Retrieve tasks filtered by priority level.

**Endpoint:** `GET /tasks/priority/:level`

**Parameters:**
- `level` (path parameter): Priority level - must be `low`, `medium`, or `high`

**Examples:**
```bash
GET /tasks/priority/high
GET /tasks/priority/medium
GET /tasks/priority/low
```

**Response:**
- **Status Code:** 200 OK
- **Body:** Array of tasks with the specified priority

**Error Response:**
- **Status Code:** 400 Bad Request (invalid priority level)
- **Body:**
```json
{
  "error": "Invalid priority level. Must be one of: low, medium, high"
}
```

---

### 3. Get Task by ID

Retrieve a specific task by its ID.

**Endpoint:** `GET /tasks/:id`

**Parameters:**
- `id` (path parameter): The ID of the task to retrieve

**Response:**
- **Status Code:** 200 OK
- **Body:** Task object
```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true,
  "priority": "medium",
  "createdAt": "2025-12-28T16:30:59.889Z"
}
```

**Error Response:**
- **Status Code:** 404 Not Found
- **Body:**
```json
{
  "error": "Task not found"
}
```

---

### 4. Create a New Task

Create a new task.

**Endpoint:** `POST /tasks`

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "priority": "high"
}
```

**Required Fields:**
- `title` (string): The title of the task (must be non-empty)
- `description` (string): The description of the task (must be non-empty)
- `completed` (boolean): Whether the task is completed

**Optional Fields:**
- `priority` (string): Priority level - `"low"`, `"medium"`, or `"high"` (defaults to `"medium"`)

**Response:**
- **Status Code:** 201 Created
- **Body:** Created task object with generated ID and timestamp
```json
{
  "id": 16,
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "priority": "high",
  "createdAt": "2025-12-28T16:30:59.889Z"
}
```

**Error Response:**
- **Status Code:** 400 Bad Request (when required fields are missing or invalid)
- **Body:**
```json
{
  "error": "title is required and must be a non-empty string"
}
```
or
```json
{
  "error": "priority must be one of: low, medium, high"
}
```

---

### 5. Update a Task

Update an existing task by its ID.

**Endpoint:** `PUT /tasks/:id`

**Parameters:**
- `id` (path parameter): The ID of the task to update

**Request Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true,
  "priority": "low"
}
```

**Required Fields:**
- `title` (string): The title of the task
- `description` (string): The description of the task
- `completed` (boolean): Whether the task is completed

**Optional Fields:**
- `priority` (string): Priority level - `"low"`, `"medium"`, or `"high"` (if not provided, preserves existing priority)

**Response:**
- **Status Code:** 200 OK
- **Body:** Updated task object (preserves original `createdAt` timestamp)
```json
{
  "id": 1,
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true,
  "priority": "low",
  "createdAt": "2025-12-28T16:30:59.889Z"
}
```

**Error Responses:**
- **Status Code:** 404 Not Found (when task ID doesn't exist)
- **Body:**
```json
{
  "error": "Task not found"
}
```

- **Status Code:** 400 Bad Request (when required fields are missing or invalid types)
- **Body:**
```json
{
  "error": "completed must be a boolean"
}
```

---

### 6. Delete a Task

Delete a task by its ID.

**Endpoint:** `DELETE /tasks/:id`

**Parameters:**
- `id` (path parameter): The ID of the task to delete

**Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "message": "Task deleted successfully"
}
```

**Error Response:**
- **Status Code:** 404 Not Found
- **Body:**
```json
{
  "error": "Task not found"
}
```

---

## Testing

Run the test suite:
```bash
npm test
```

The tests use the `tap` testing framework and `supertest` for HTTP assertions. All tests should pass.

## Example Usage

### Using curl

**Get all tasks:**
```bash
curl http://localhost:3000/tasks
```

**Get all completed tasks:**
```bash
curl http://localhost:3000/tasks?completed=true
```

**Get all incomplete tasks sorted oldest first:**
```bash
curl "http://localhost:3000/tasks?completed=false&sort=oldest"
```

**Get tasks by priority:**
```bash
curl http://localhost:3000/tasks/priority/high
curl http://localhost:3000/tasks/priority/medium
curl http://localhost:3000/tasks/priority/low
```

**Get a specific task:**
```bash
curl http://localhost:3000/tasks/1
```

**Create a new task:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete assignment",
    "description": "Finish the task manager API",
    "completed": false,
    "priority": "high"
  }'
```

**Create a task without priority (defaults to medium):**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Regular task",
    "description": "No priority specified",
    "completed": false
  }'
```

**Update a task:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "description": "Updated description",
    "completed": true,
    "priority": "low"
  }'
```

**Delete a task:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

### Using Postman

1. **Get All Tasks:**
   - Method: `GET`
   - URL: `http://localhost:3000/tasks`
   - Query params (optional): `completed=true`, `sort=oldest`

2. **Get Tasks by Priority:**
   - Method: `GET`
   - URL: `http://localhost:3000/tasks/priority/high`

3. **Create Task:**
   - Method: `POST`
   - URL: `http://localhost:3000/tasks`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "title": "New Task",
       "description": "Task description",
       "completed": false,
       "priority": "high"
     }
     ```

4. **Update Task:**
   - Method: `PUT`
   - URL: `http://localhost:3000/tasks/1`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON): Same format as create

5. **Delete Task:**
   - Method: `DELETE`
   - URL: `http://localhost:3000/tasks/1`

## Input Validation

The API validates all input data:

- **Title and Description:**
  - Must be provided (not undefined/null)
  - Must be strings
  - Must be non-empty (after trimming whitespace)
  - Whitespace-only strings are rejected

- **Completed Status:**
  - Must be a boolean (`true` or `false`)
  - String values like `"true"` are rejected

- **Priority:**
  - Optional field
  - If provided, must be one of: `"low"`, `"medium"`, `"high"`
  - Case-insensitive matching
  - Defaults to `"medium"` if not specified

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request:** 
  - Invalid input data (missing required fields, wrong data types, empty strings, invalid priority values)
  - Invalid query parameters
  
- **404 Not Found:** 
  - Resource not found (invalid task ID)
  
- **500 Internal Server Error:** 
  - Server-side errors (handled by Express default error handler)

All error responses include a JSON body with an `error` field describing the issue.

## Data Storage

The API uses in-memory storage initialized from `task.json` when the server starts. This means:
- Data persists only while the server is running
- Data is reset to the initial state from `task.json` when the server restarts
- No database is required for this implementation
- Tasks created during runtime are lost when the server stops

## Project Structure

```
task-manager-api/
├── app.js              # Main application file with all routes and logic
├── package.json        # Project dependencies and scripts
├── task.json          # Initial task data
├── test/
│   └── server.test.js  # Test suite
└── README.md          # This file
```

## License

ISC

## Author

Airtribe
