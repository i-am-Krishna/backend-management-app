
const { validationResult } = require('express-validator');
const TaskModel = require('../models/taskmodel.js');
const UserModel = require('../models/usermodel.js');
const { formatDueDate } = require('../helpers/formatDueDate.js');
const { getDateFilterRange } = require('../helpers/filterDates.js');
const { STATUS_CODES, MESSAGES, VALID_STATUSES } = require('../constants/taskconstant.js');


// Controller to create a new task
const addTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { title, checklist, dueDate, priority, assignedUserId } = req.body;
    const id = req.user; // Assuming middleware sets the authenticated user in req.user

    // Create a new task object with the ownerId explicitly set
    const newTask = new TaskModel({
      title,
      checklist,
      dueDate,
      priority,
      ownerId: id, // Owner of the task
      userIds: [id], // Include the owner in the userIds array by default
    });
    // If an assigned user is provided and it's different from the owner, add them to userIds array
    if (assignedUserId && assignedUserId !== id.toString()) {
      const assignedUser = await UserModel.findById(assignedUserId);
      if (!assignedUser) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.ASSIGNED_USER_NOT_FOUND });
      }
      newTask.userIds.push(assignedUserId);
    }
    // Save the task to the database
    const savedTask = await newTask.save();
    return res.status(STATUS_CODES.CREATED).json({ message: MESSAGES.TASK_CREATED, task: savedTask });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const id = req.user; // Assuming middleware sets the authenticated user in req.user
    const { filterBy } = req.query; // Get the filter parameter from the query string

    // Get the date range using the filter utility function
    const { startDate, endDate } = getDateFilterRange(filterBy);

    // Build the date filter to include tasks without a due date or those that match the date range
    const dateFilter = startDate && endDate
      ? { $or: [{ dueDate: { $gte: startDate, $lte: endDate } }, { dueDate: null }] }
      : {};

    // Find tasks where the user is either the owner or is assigned to the task, with optional date filtering
    const tasks = await TaskModel.find({
      $and: [
        {
          $or: [
            { ownerId: id }, // Tasks created by the user
            { userIds: id }  // Tasks assigned to the user
          ]
        },
        dateFilter
      ]
    })
      .populate('ownerId', '_id name') // Populate owner details if needed
      .populate('userIds', '_id name'); // Populate assigned users' details

    // Format the dueDate before sending the response using the format utility
    const formattedTasks = tasks.map(task => {
      const formattedDueDate = formatDueDate(task.dueDate);

      return {
        ...task._doc,
        dueDate: formattedDueDate || null, // Update dueDate to show formatted date or null
      };
    });

    // Return the tasks found with formatted dates
    return res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.TASKS_RETRIEVED, tasks: formattedTasks });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
  }
};



// Controller to retrieve a single task by its ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params; // Get task ID from request parameters
    const task = await TaskModel.findById(id); // Find the task by its ID

    // Check if the task exists
    if (!task) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.TASK_NOT_FOUND });
    }

    // Return the retrieved task
    return res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.TASK_RETRIEVED, task });
  } catch (error) {
    // Handle any errors during task retrieval
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
  }
}


const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params; // Task ID from the request URL
    const { status } = req.body; // New status from the request body
    const userId = req.user; // Assuming middleware sets the authenticated user in req.user

    // Validate the new status to make sure it matches one of the allowed values
    const validStatuses = VALID_STATUSES;
    if (!validStatuses.includes(status)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.INVALID_STATUS });
    }
    // Find the task by ID
    const task = await TaskModel.findById(id);

    // Check if the task exists
    if (!task) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.TASK_NOT_FOUND });
    }

    // Check if the user is authorized to update the task
    if (!task.userIds.includes(userId)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({ message: MESSAGES.UNAUTHORIZED });
    }

    // Update the task status if the user is authorized
    task.status = status;
    const updatedTask = await task.save();

    // Return the updated task
    return res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.STATUS_UPDATED, task: updatedTask });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
  }
};


const getTaskCounts = async (req, res) => {
  try {
    const userId = req.user; // Assuming req.user contains the userId

    // Fetch tasks for the user
    const tasks = await TaskModel.find({
      $or: [{ ownerId: userId }, { userIds: userId }]
    });

    // Initialize counts object
    const taskCounts = {
      status: {
        backlog: 0,
        todo: 0,
        inprogress: 0,
        completed: 0,
      },
      priority: {
        lowpriority: 0,
        moderatepriority: 0,
        highpriority: 0,
      },
      dueDateCount: 0,
    };

    // Iterate through tasks and count status and priority
    tasks.forEach(task => {
      // Count status
      const statusKey = task.status.toLowerCase().replace(' ', '');
      if (taskCounts.status[statusKey] !== undefined) {
        taskCounts.status[statusKey]++;
      }

      // Count priority
      const priorityKey = task.priority.toLowerCase().replace(' ', '');
      if (taskCounts.priority[priorityKey] !== undefined) {
        taskCounts.priority[priorityKey]++;
      }

      // Count tasks with due dates
      if (task.dueDate) {
        taskCounts.dueDateCount++;
      }
    });

    return res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.TASK_COUNTS_RETRIEVED, taskCounts });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
  }
};


const assignAllTasks = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from request parameters

    // Find all tasks
    const tasks = await TaskModel.find({});

    if (tasks.length === 0) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.NO_TASKS_FOUND });
    }

    // Update userIds for each task
    const updatedTasks = await Promise.all(tasks.map(async (task) => {
      // Check if userId is already in userIds to avoid duplicates
      if (!task.userIds.includes(id)) {
        task.userIds.push(id); // Assign user to task
        return await task.save(); // Save the updated task
      }
      return task; // Return task without changes if user already assigned
    }));

    return res.status(STATUS_CODES.SUCCESS).json({
      message: MESSAGES.TASKS_ASSIGNED,
      tasks: updatedTasks,
    });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
  }
};


const deleteTask = async (req, res) => {
  try {
    const { id } = req.params; // Get task ID from request parameters

    // Find the task by ID and remove it
    const deletedTask = await TaskModel.findByIdAndDelete(id);

    // Check if the task was found and deleted
    if (!deletedTask) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.TASK_NOT_FOUND });
    }

    return res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.TASK_DELETED, task: deletedTask });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
  }
};


const updateChecklist = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params; // Extract task ID and subtask ID from the request parameters
    const { done } = req.body; // Extract the new status from the request body

    // Find the task and update the specific subtask's 'done' status
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: taskId, 'checklist._id': subtaskId }, // Match the task and the specific subtask
      { $set: { 'checklist.$.done': done } }, // Update the 'done' status of the matched subtask
      { new: true } // Return the updated document
    );

    // Check if the task or subtask was found and updated
    if (!updatedTask) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.NO_SUBTASKS_FOUND });
    }

    return res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.SUBTASK_UPDATED, task: updatedTask });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
  }
};


const deleteSubtask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params; // Extract task ID and subtask ID from the request parameters

    // Find the task and remove the specific subtask from the checklist
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: taskId }, // Match the task by its ID
      { $pull: { checklist: { _id: subtaskId } } }, // Remove the subtask with the matching subtask ID
      { new: true } // Return the updated document
    );

    // Check if the task or subtask was found and updated
    if (!updatedTask) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.NO_SUBTASKS_FOUND });
    }

    return res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.SUBTASK_DELETED, task: updatedTask });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
  }
};


const updateTask = async (req, res) => {
  try {

    const { taskId } = req.params;
    const { title, checklist, priority, assignedUserId, dueDate } = req.body;

    // Find the task by its ID
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.TASK_NOT_FOUND });
    }

    // Update mandatory fields
    task.title = title;
    task.priority = priority;

    // Merge checklist items: update existing ones or add new ones
    checklist.forEach(newItem => {
      if (newItem._id) {
        // If the checklist item has an ID, update the existing item
        const existingItem = task.checklist.find(item => item._id.toString() === newItem._id);
        if (existingItem) {
          existingItem.subtask = newItem.subtask || existingItem.subtask;
          existingItem.done = newItem.done !== undefined ? newItem.done : existingItem.done;
        }
      } else {
        // If the checklist item doesn't have an ID, add it as a new item
        task.checklist.push(newItem);
      }
    });

    // Update optional fields if they are provided
    if (dueDate) {
      task.dueDate = dueDate;
    }

    // If an assigned user is provided and it's different from the owner, add them to the userIds array
    if (assignedUserId && !task.userIds.includes(assignedUserId)) {
      const assignedUser = await UserModel.findById(assignedUserId);
      if (!assignedUser) {
        return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.ASSIGNED_USER_NOT_FOUND });
      }
      task.userIds.push(assignedUserId);
    }

    // Save the updated task to the database
    const updatedTask = await task.save();
    return res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.TASK_UPDATED, task: updatedTask });
  } catch (error) {
    return res.status(STATUS_CODES.SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR, error: error.message });
  }
};


module.exports = {
  addTask,
  getAllTasks,
  getTaskById,
  updateTaskStatus,
  getTaskCounts,
  assignAllTasks,
  deleteTask,
  updateChecklist,
  deleteSubtask,
  updateTask
};
