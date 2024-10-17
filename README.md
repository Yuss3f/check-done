# Check Done - To-Do List Web Application

**Check Done** is a simple and fully functional **To-Do List Web Application** that allows users to add, delete, and mark tasks as complete. The project was built using basic HTML, CSS, and JavaScript, and it utilizes the browser's localStorage for client-side task storage, as well as a MongoDB database for server-side task management.

## Features :sparkles:

- Add new tasks to the to-do list
- Mark tasks as completed by clicking on them
- Delete tasks from the list
- Tasks are saved in localStorage, so they persist even after refreshing the browser or reopening the app
- Server-side storage of tasks using MongoDB for persistent data management
- RESTful API for task operations (Create, Read, Update, Delete)

## Tech Stack :computer:

- **HTML5** - Used to structure the web page
- **CSS3** - Used for styling the web app
- **JavaScript (ES6)** - Provides the core functionality for adding, deleting, and marking tasks as completed
- **localStorage** - Used to save the to-do list data locally in the browser
- **Node.js** - Backend environment for running the server
- **Express** - Framework for building the web server
- **MongoDB** - NoSQL database for storing tasks
- **Mongoose** - ODM for MongoDB, used for data modeling
- **Jest** - Testing framework for running unit tests

## File Structure :file_folder:

```plaintext
/Check_Done
│
├── /public
│   ├── index.html       # Main HTML file
│   ├── style.css        # Styling for the application
│   └── script.js        # JavaScript logic for the application
│
├── /models
│   ├── Task.js          # Mongoose model for tasks
│
├── /tests
│   ├── task.test.js     # Test suite for task operations
│
├── server.js            # Main server file for the Express app
├── package.json         # Project metadata and dependencies
└── README.md            # This file

```
## How to Run the Project :white_check_mark:

To run the project locally, follow these steps:
1. **Clone the repository**
``` bash
git clone https://github.com/Yuss3f/Check_Done.git
```
2. **Navigate to the project directory:**
``` bash
cd Check_Done
```
3. **Install the dependencies:**
```bash
npm install
```

4. **Set up your MongoDB connection:**

* Create a .env file in the root of the project and add your MongoDB URI:
```plaintext
MONGODB_URI=your_mongodb_connection_string
```
5. Start the server:
````bash
npm start
```
6. Open the app in your browser:

* Navigate to http://localhost:5000 in your browser to access the app.

## How It Works :bar_chart:

1. Type a new task in the input field.
2. Click the "Add" button to add the task to the list.
3. Click on a task to mark it as completed.
4. Click the "Delete" button next to any task to remove it from the list.
5. All tasks are saved in localStorage and will remain available even after refreshing the page. Server-side, tasks are stored in MongoDB.

## Future Improvements :watch:

Some possible features that can be added to Check Down:

* User authentication for personalized to-do lists
* Integration with additional cloud services for data storage
* Add categories or tags for tasks
* Add due dates and reminders for tasks

## Author :pencil2:

- [Youssef Kayk](https://github.com/Yuss3f) - [LinkedIn Profile](https://www.linkedin.com/in/youssef-kayk-5a4323190/)

Feel free to fork the repository, contribute, or provide feedback!
