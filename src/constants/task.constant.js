// Status codes for HTTP responses
const STATUS_CODES = {
  SUCCESS: 200,               // OK
  CREATED: 201,               // Resource created successfully
  BAD_REQUEST: 400,           // Client-side error in the request
  NOT_FOUND: 404,             // Resource not found
  FORBIDDEN: 403,             // Access to the resource is forbidden
  SERVER_ERROR: 500           // Internal server error
};

// Messages used in API responses
const MESSAGES = {
  TASK_CREATED: 'Task created successfully',            // Success message for task creation
  TASK_RETRIEVED: 'Task retrieved successfully',        // Success message for retrieving a task
  TASK_UPDATED: 'Task updated successfully',            // Success message for updating a task
  TASK_DELETED: 'Task deleted successfully',            // Success message for deleting a task
  TASK_NOT_FOUND: 'Task not found',                     // Error message when a task is not found
  ASSIGNED_USER_NOT_FOUND: 'Assigned user not found',   // Error message for missing assigned user
  TASKS_ASSIGNED: 'All tasks assigned successfully',     // Success message for assigning tasks
  TASKS_RETRIEVED: 'Tasks retrieved successfully',       // Success message for retrieving multiple tasks
  TASK_COUNTS_RETRIEVED: 'Task counts retrieved successfully', // Success message for retrieving task counts
  STATUS_UPDATED: 'Task status updated successfully',    // Success message for updating task status
  UNAUTHORIZED: 'Not authorized to update this task',    // Error message for unauthorized access
  INVALID_STATUS: 'Invalid status value',                // Error message for invalid status
  NO_TASKS_FOUND: 'No tasks found to assign',            // Error message when no tasks are available for assignment
  NO_SUBTASKS_FOUND: 'Task or subtask not found',       // Error message for missing task or subtask
  SUBTASK_UPDATED: 'Subtask status updated successfully', // Success message for updating a subtask
  SUBTASK_DELETED: 'Subtask deleted successfully',       // Success message for deleting a subtask
  SERVER_ERROR: 'Server error, please try again later', // General server error message
};

// Valid status values for tasks
const VALID_STATUSES = ['Backlog', 'To do', 'In progress', 'Done'];
// Valid priority values for tasks
const VALID_PRIORITIES = ['Low Priority', 'Moderate Priority', 'High Priority'];

// Export constants for use in other modules
module.exports = {
  STATUS_CODES,
  MESSAGES,
  VALID_STATUSES,
  VALID_PRIORITIES
};
