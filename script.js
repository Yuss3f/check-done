document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");

  // Load tasks from the server
  loadTasks();

  // Add Task
  addTaskBtn.addEventListener("click", async function () {
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
      const newTask = { text: taskText, completed: false };
      await addTaskToServer(newTask); // Send task to server
      taskInput.value = ""; // Clear the input field
    }
  });

  // Load tasks from the server
  async function loadTasks() {
    const response = await fetch("http://localhost:5000/tasks");
    const tasks = await response.json();
    tasks.forEach(task => {
      addTask(task.text, task.completed);
    });
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
    await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task)
    });
  }

  // Function to delete task from the server
  async function deleteTaskFromServer(taskText) {
    const tasks = await fetch("http://localhost:5000/tasks");
    const allTasks = await tasks.json();
    const taskToDelete = allTasks.find(task => task.text === taskText);

    if (taskToDelete) {
      await fetch(`http://localhost:5000/tasks/${taskToDelete._id}`, {
        method: "DELETE"
      });
    }
  }
});

