const mongoose = require('mongoose');

// Define the schema for tasks
const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,   // Task title is required
    },
    completed: {
        type: Boolean,
        default: false,   // By default, a task is not completed
    }
}, { timestamps: true });  // Automatically add createdAt and updatedAt timestamps

// Export the Task model, based on the TaskSchema
module.exports = mongoose.model('Task', TaskSchema);

