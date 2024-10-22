// Importing the express library to create the router
const express = require("express");
// Creating a router instance for task-related routes
const taskRouter = express.Router();
// Importing the task controller that contains the business logic for tasks
const taskController = require("../controllers/taskcontroller.js");
// Importing the authentication middleware to protect certain routes
const { authentication } = require('../middlewares/authentication.js');
// Importing validation rules for task data
const validation = require("../validators/taskvalidators.js");

// Route to get all tasks; protected by authentication middleware
taskRouter.get("/", authentication, taskController.getAllTasks);

// Route to get the count of all tasks; protected by authentication middleware
taskRouter.get("/count", authentication, taskController.getTaskCounts);

// Route to get a specific task by ID; no authentication required
taskRouter.get("/:id", taskController.getTaskById);

// Route to add a new task; protected by authentication and validates task data
taskRouter.post("/", authentication, validation.validateTask, taskController.addTask);

// Route to assign all tasks to a specific user by ID; protected by authentication
taskRouter.post('/assign-all/:id', authentication, taskController.assignAllTasks);

// Route to update the status of a specific task by ID; protected by authentication
taskRouter.patch("/:id", authentication, taskController.updateTaskStatus);

// Route to update a specific task; protected by authentication
taskRouter.patch("/update/:taskId", authentication, taskController.updateTask);

// Route to update a checklist item of a specific task; protected by authentication
taskRouter.patch("/:taskId/:subtaskId", authentication, taskController.updateChecklist);

// Route to delete a specific task by ID; protected by authentication
taskRouter.delete('/:id', authentication, taskController.deleteTask);

// Route to delete a specific subtask; protected by authentication
taskRouter.delete('/:taskId/:subtaskId', authentication, taskController.deleteSubtask);

// Exporting the task router for use in the main application
module.exports = taskRouter;
