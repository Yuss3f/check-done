document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");

  // Load tasks from the server
  loadTasks();

  // Add Task
  async function addTaskHandler() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      const newTask = { text: taskText, completed: false };
      await addTaskToServer(newTask); // Send task to server
      taskInput.value = ""; // Clear the input field
    } else {
      console.error("Task input is empty");
    }
  }

  // Add task when clicking the button
  addTaskBtn.addEventListener("click", addTaskHandler);

  // Add task when pressing the Enter key
  taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") { // Check if the key pressed is "Enter"
      addTaskHandler(); // Call the function to add the task
    }
  });

  // Load tasks from the server
  async function loadTasks() {
    try {
      const response = await fetch("http://localhost:5000/tasks");
      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }
      const tasks = await response.json();
      tasks.forEach(task => {
        addTask(task.text, task.completed);
      });
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }

  // Add Task to the DOM
  function addTask(taskText, isCompleted) {
    const listItem = document.createElement("li");
    if (isCompleted) listItem.classList.add("completed");

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;
    taskSpan.classList.add("task-text");
    listItem.appendChild(taskSpan);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    listItem.appendChild(deleteBtn);

    taskList.appendChild(listItem);

    // Mark task as completed
    taskSpan.addEventListener("click", function () {
      listItem.classList.toggle("completed");
      // You can add a function to update task completion status here
    });

    // Delete task
    deleteBtn.addEventListener("click", async function () {
      await deleteTaskFromServer(taskText); // Call delete API
      taskList.removeChild(listItem);
    });
  }

  // Function to add task to the server
  async function addTaskToServer(task) {
    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
      });
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  // Function to delete task from the server
  async function deleteTaskFromServer(taskText) {
    try {
      const response = await fetch("http://localhost:5000/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks for deletion");
      }

      const allTasks = await response.json();
      const taskToDelete = allTasks.find(task => task.text === taskText);

      if (taskToDelete) {
        const deleteResponse = await fetch(`http://localhost:5000/tasks/${taskToDelete._id}`, {
          method: "DELETE"
        });
        if (!deleteResponse.ok) {
          throw new Error("Failed to delete task");
        }
      } else {
        console.error("Task not found for deletion");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
});
