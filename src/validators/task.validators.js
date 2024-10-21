// Importing body from express-validator to create validation rules for task inputs
const { body } = require('express-validator');

// Validation rules for task creation and update
const validateTask = [
  // Validate 'title' field
  body('title')
    .trim() // Remove whitespace from both ends of the title
    .notEmpty().withMessage('Title is required') // Ensure title is not empty
    .isString().withMessage('Title must be a string'), // Ensure title is a string
  
  // Validate 'checklist' field
  body('checklist')
    .isArray({ min: 1 }).withMessage('Checklist must be a non-empty array of subtasks') // Ensure checklist is a non-empty array
    .custom((value) => {
      // Check if each item in the checklist has a 'subtask' property of type string
      return value.every(subtask => subtask.subtask && typeof subtask.subtask === 'string');
    }).withMessage('Each checklist item must have a subtask property of type string'),
  
  // Validate 'dueDate' field
  body('dueDate')
    .optional() // This field is optional
    .isISO8601().withMessage('Due date must be a valid date'), // Ensure due date is in ISO 8601 format

  // Validate 'status' field
  body('status')
    .optional() // This field is optional
    .isIn(['Backlog', 'To do', 'In progress', 'Done']).withMessage('Invalid status value'), // Ensure status is one of the defined values

  // Validate 'priority' field
  body('priority')
    .optional() // This field is optional
    .isIn(['Low Priority', 'Moderate Priority', 'High Priority']).withMessage('Invalid priority value'), // Ensure priority is one of the defined values

  // Validate 'assignedUserId' field
  body('assignedUserId')
    .optional() // This field is optional
    .isMongoId().withMessage('Assigned user ID must be a valid MongoDB ObjectId') // Ensure assignedUserId is a valid MongoDB ObjectId
];

// Exporting the task validation rules for use in other parts of the application
module.exports = { validateTask };
