const request = require('supertest');
const app = require('../server'); // Import your Express app
const Task = require('../models/Task'); // Import the Task model

describe('Task API', () => {
    beforeEach(async () => {
        await Task.deleteMany({}); // Clear the tasks collection before each test
    });

    // Test GET all tasks
    it('should return all tasks', async () => {
        const response = await request(app).get('/tasks');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]); // Expect an empty array initially
    });

    // Test POST a new task
    it('should create a new task', async () => {
        const newTask = { title: 'Test Task' };
        const response = await request(app)
            .post('/tasks')
            .send(newTask);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTask.title);
        expect(response.body.completed).toBe(false); // Default value
    });

    // Test PUT (update) a task
    it('should update a task', async () => {
        const task = new Task({ title: 'Task to Update' });
        await task.save(); // Save the initial task

        const updatedData = { title: 'Updated Task', completed: true };
        const response = await request(app)
            .put(`/tasks/${task._id}`)
            .send(updatedData);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedData.title);
        expect(response.body.completed).toBe(updatedData.completed);
    });

    // Test DELETE a task
    it('should delete a task', async () => {
        const task = new Task({ title: 'Task to Delete' });
        await task.save(); // Save the initial task

        const response = await request(app).delete(`/tasks/${task._id}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Task deleted successfully');
        
        // Check that the task is deleted
        const deletedTask = await Task.findById(task._id);
        expect(deletedTask).toBeNull(); // Expect the task to be null
    });
});

