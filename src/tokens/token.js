// Importing the jsonwebtoken library for creating JSON Web Tokens
const jwt = require("jsonwebtoken");
// Importing dotenv to manage environment variables
const dotenv = require("dotenv");
// Loading environment variables from the .env file
dotenv.config();

// Function to generate a JSON Web Token
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }
    if (!process.env.EXPIRES_IN) {
        throw new Error("EXPIRES_IN is not defined in the environment variables.");
    }

    // Creating a token with the specified payload and options
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN, // Token expiration time, defined in environment variables
    });
};  

// Exporting the generateToken function for use in other parts of the application
module.exports = { generateToken };

