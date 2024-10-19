document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");

  // Load tasks from the server when DOM is loaded
  loadTasks();

  // Add Task
  async function addTaskHandler() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      const newTask = { text: taskText, completed: false };
      try {
        await addTaskToServer(newTask); // Send task to server
        taskInput.value = ""; // Clear the input field
      } catch (error) {
        console.error("Error adding task:", error);
      }
    } else {
      console.error("Task input is empty");
    }
  }

  // Add task when clicking the button
  addTaskBtn.addEventListener("click", addTaskHandler);

  // Add task when pressing the Enter key
  taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addTaskHandler();
    }
  });

  // Load tasks from the server
  async function loadTasks() {
    try {
      const response = await fetch("http://127.0.0.1:5500/tasks", {
        method: "GET",
        credentials: "include"  // Include cookies for authentication
      });
      if (!response.ok) {
        if (response.status === 401) {
          alert("You might not be logged in. Please log in to see your tasks.");
          return;
        }
        throw new Error("Failed to load tasks");
      }
      const tasks = await response.json();
      tasks.forEach(task => {
        addTask(task.text, task.completed);
      });
    } catch (error) {
      console.error("Error loading tasks:", error);
      alert("Error loading tasks. Please try again later.");
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
      updateTaskStatus(taskText, listItem.classList.contains("completed"));
    });

    // Delete task
    deleteBtn.addEventListener("click", async function () {
      await deleteTaskFromServer(taskText);
      taskList.removeChild(listItem);
    });
  }

  // Function to add task to the server
  async function addTaskToServer(task) {
    try {
      const response = await fetch("http://127.0.0.1:5500/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(task)
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in.");
        }
        throw new Error("Failed to add task");
      }
      const savedTask = await response.json();
      addTask(savedTask.text, savedTask.completed);
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Error adding task. Make sure you are logged in.");
    }
  }

  // Function to delete task from the server
  async function deleteTaskFromServer(taskText) {
    try {
      const response = await fetch("http://127.0.0.1:5500/tasks", {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in.");
        }
        throw new Error("Failed to fetch tasks for deletion");
      }

      const allTasks = await response.json();
      const taskToDelete = allTasks.find(task => task.text === taskText);

      if (taskToDelete) {
        const deleteResponse = await fetch(`http://127.0.0.1:5500/tasks/${taskToDelete._id}`, {
          method: "DELETE",
          credentials: "include"
        });
        if (!deleteResponse.ok) {
          if (deleteResponse.status === 401) {
            throw new Error("Unauthorized. Please log in.");
          }
          throw new Error("Failed to delete task");
        }
      } else {
        console.error("Task not found for deletion");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task. Make sure you are logged in.");
    }
  }

  // Function to update task completion status
  async function updateTaskStatus(taskText, isCompleted) {
    try {
      const response = await fetch("http://127.0.0.1:5500/tasks", {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tasks for updating status");
      }

      const allTasks = await response.json();
      const taskToUpdate = allTasks.find(task => task.text === taskText);

      if (taskToUpdate) {
        const updateResponse = await fetch(`http://127.0.0.1:5500/tasks/${taskToUpdate._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ completed: isCompleted })
        });
        if (!updateResponse.ok) {
          throw new Error("Failed to update task status");
        }
      } else {
        console.error("Task not found for updating status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  }
});

// Function to check if user is authenticated
async function checkAuthStatus() {
  try {
    const response = await fetch('http://localhost:5000/auth-status', {
      method: 'GET',
      credentials: 'include' // Include credentials to check session
    });
    const authStatus = await response.json();
    if (authStatus.authenticated) {
      loadTasks(); // If authenticated, load tasks
    } else {
      console.log('You might not be logged in. Please log in to see your tasks.');
    }
  } catch (error) {
    console.error('Error checking authentication status:', error);
  }
}
