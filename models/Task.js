const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

// Check if the model already exists
const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

module.exports = Task; // Export the Task model

