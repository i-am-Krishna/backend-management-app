// Importing Mongoose to create the schema and model
const mongoose = require("mongoose");

// Defining the user schema
const userSchema = new mongoose.Schema({
    // User's name; required, must be at least 3 characters long, and trimmed of whitespace
    name: {
        type: String,
        required: true,
        minlength: 3, // Minimum length of 3 characters
        trim: true,   // Removes whitespace from both ends
    },
    // User's email; required, must be unique in the database, and trimmed of whitespace
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no duplicate email addresses
        trim: true,   // Removes whitespace from both ends
    },
    // User's password; required field
    password: {
        type: String,
        required: true, // Password is mandatory
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// Creating the User model based on the schema
const UserModel = mongoose.model("User", userSchema);

// Exporting the User model for use in other parts of the application
module.exports = UserModel;
