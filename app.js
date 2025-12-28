const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load initial tasks from task.json
let tasks = [];
try {
  const tasksData = fs.readFileSync(path.join(__dirname, 'task.json'), 'utf8');
  const tasksJson = JSON.parse(tasksData);
  tasks = tasksJson.tasks || [];
  // Add default priority and createdAt to existing tasks for backward compatibility
  tasks = tasks.map(task => ({
    ...task,
    priority: task.priority || 'medium',
    createdAt: task.createdAt || new Date().toISOString()
  }));
} catch (error) {
  console.error('Error loading initial tasks:', error);
  tasks = [];
}

// Helper function to validate task data
function validateTask(task, requireAllFields = true) {
  if (requireAllFields) {
    if (!task.title || typeof task.title !== 'string' || task.title.trim().length === 0) {
      return { valid: false, message: 'title is required and must be a non-empty string' };
    }
    if (!task.description || typeof task.description !== 'string' || task.description.trim().length === 0) {
      return { valid: false, message: 'description is required and must be a non-empty string' };
    }
    if (task.completed === undefined || typeof task.completed !== 'boolean') {
      return { valid: false, message: 'completed is required and must be a boolean' };
    }
  } else {
    if (task.title !== undefined && (typeof task.title !== 'string' || task.title.trim().length === 0)) {
      return { valid: false, message: 'title must be a non-empty string' };
    }
    if (task.description !== undefined && (typeof task.description !== 'string' || task.description.trim().length === 0)) {
      return { valid: false, message: 'description must be a non-empty string' };
    }
    if (task.completed !== undefined && typeof task.completed !== 'boolean') {
      return { valid: false, message: 'completed must be a boolean' };
    }
  }
  
  // Validate priority if provided (optional field)
  if (task.priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(task.priority)) {
      return { valid: false, message: 'priority must be one of: low, medium, high' };
    }
  }
  
  return { valid: true };
}

// GET /tasks - Get all tasks (with filtering and sorting)
app.get('/tasks', (req, res) => {
  let filteredTasks = [...tasks];
  
  // Filter by completion status if query parameter provided
  if (req.query.completed !== undefined) {
    const completedFilter = req.query.completed === 'true';
    filteredTasks = filteredTasks.filter(task => task.completed === completedFilter);
  }
  
  // Sort by creation date (newest first by default, or oldest first with ?sort=oldest)
  filteredTasks.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    if (req.query.sort === 'oldest') {
      return dateA - dateB;
    }
    // Default: newest first
    return dateB - dateA;
  });
  
  res.status(200).json(filteredTasks);
});

// GET /tasks/priority/:level - Get tasks by priority level
app.get('/tasks/priority/:level', (req, res) => {
  const level = req.params.level.toLowerCase();
  const validPriorities = ['low', 'medium', 'high'];
  
  if (!validPriorities.includes(level)) {
    return res.status(400).json({ error: 'Invalid priority level. Must be one of: low, medium, high' });
  }
  
  const filteredTasks = tasks.filter(task => (task.priority || 'medium').toLowerCase() === level);
  res.status(200).json(filteredTasks);
});

// GET /tasks/:id - Get a specific task by id
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.status(200).json(task);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const validation = validateTask(req.body, true);
  
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }
  
  // Generate new ID (get max ID and add 1)
  const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
  const newTask = {
    id: maxId + 1,
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
    priority: req.body.priority || 'medium', // Default to medium if not provided
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  // Validate that all required fields are present and valid
  const validation = validateTask(req.body, true);
  
  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }
  
  // Preserve createdAt if it exists, otherwise set to current time
  const existingTask = tasks[taskIndex];
  tasks[taskIndex] = {
    id: id,
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
    priority: req.body.priority || existingTask.priority || 'medium',
    createdAt: existingTask.createdAt || new Date().toISOString()
  };
  
  res.status(200).json(tasks[taskIndex]);
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: 'Task deleted successfully' });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;