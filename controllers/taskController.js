const Task = require('../models/Task'); // Import the Task model

// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find(); // Fetch all tasks
        res.status(200).json(tasks); // Return tasks as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};

// Create a new task
const createTask = async (req, res) => {
    const { title, completed } = req.body; // Destructure title and completed from request body

    const newTask = new Task({
        title,
        completed: completed || false, // Default to false if not provided
    });

    try {
        const savedTask = await newTask.save(); // Save the task to the database
        res.status(201).json(savedTask); // Return the saved task as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error });
    }
};

// Update a task by ID
const updateTask = async (req, res) => {
    const { id } = req.params; // Get task ID from request parameters
    const { title, completed } = req.body; // Get updated title and completed status

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, completed },
            { new: true } // Return the updated document
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' }); // Handle case where task is not found
        }
        res.json(updatedTask); // Return the updated task as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error });
    }
};

// Delete a task by ID
const deleteTask = async (req, res) => {
    const { id } = req.params; // Get task ID from request parameters

    try {
        const deletedTask = await Task.findByIdAndDelete(id); // Delete the task

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' }); // Handle case where task is not found
        }
        res.json({ message: 'Task deleted successfully' }); // Return success message
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
};

// Export the controller functions
module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
};

