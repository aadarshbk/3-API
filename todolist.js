const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let todos = [];

// Get all todos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// Add a new todo
app.post('/todos', (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }
    const newTodo = { id: todos.length + 1, task, completed: false };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Update a todo
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    todos[todoIndex] = { ...todos[todoIndex], task, completed };
    res.json(todos[todoIndex]);
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    todos = todos.filter(todo => todo.id !== parseInt(id));
    res.sendStatus(204);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
