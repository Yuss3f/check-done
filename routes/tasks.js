const express = require('express');
const router = express.Router();
const Task = require('../models/Task');  // Import Task model

// GET all tasks (Read)
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();  // Fetch all tasks from the database
        res.json(tasks);  // Return tasks as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
});

// POST a new task (Create)
router.post('/tasks', async (req, res) => {
    const { title, completed } = req.body;

    // Create a new Task
    const newTask = new Task({
        title,
        completed: completed || false,  // By default, a new task is not completed
    });

    try {
        const savedTask = await newTask.save();  // Save the task in the database
        res.json(savedTask);  // Return the saved task as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
});

// PUT (Update) a task by ID
router.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, completed },
            { new: true }  // Return the updated task
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
});

// DELETE a task by ID
router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findByIdAndDelete(id);  // Delete the task from the database

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
});

module.exports = router;

