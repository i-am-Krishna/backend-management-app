// Importing Mongoose to create the schema and model
const mongoose = require("mongoose");
// Importing constants for valid task statuses and priorities
const { VALID_STATUSES, VALID_PRIORITIES } = require("../constants/task.constant");

// Defining the task schema
const taskSchema = new mongoose.Schema({
  // Title of the task; required and trimmed
  title: {
    type: String,
    required: true,
    trim: true,
  },
  // Checklist items associated with the task
  checklist: [
    {
      // Subtask text; required and trimmed
      subtask: {
        type: String,
        required: true,
        trim: true,
      },
      // Indicates if the subtask is completed
      done: {
        type: Boolean,
        default: false, // Defaults to false
      },
    },
  ],
  // Due date of the task; optional, defaults to null
  dueDate: {
    type: Date,
    required: false,
    default: null,
  },
  // Status of the task; must be one of the valid statuses
  status: {
    type: String,
    enum: VALID_STATUSES, // Validates against predefined statuses
    required: true,
    default: VALID_STATUSES[1], // Defaults to the second valid status
  },
  // Priority of the task; must be one of the valid priorities
  priority: {
    type: String,
    enum: VALID_PRIORITIES, // Validates against predefined priorities
    required: true,
    default: VALID_PRIORITIES[0], // Defaults to the first valid priority
  },
  // Owner of the task; references a User document
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  // Array of user IDs assigned to the task; references User documents
  userIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
  ],
}, {
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true,
});

// Creating the Task model based on the schema
const TaskModel = mongoose.model("Task", taskSchema);
// Exporting the Task model for use in other parts of the application
module.exports = TaskModel;
