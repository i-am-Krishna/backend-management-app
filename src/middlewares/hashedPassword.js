// Importing necessary libraries
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Loading environment variables from the .env file
dotenv.config();

/**
 * Hashes a plain text password using bcrypt.
 * @param {string} data - The plain text password to be hashed.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 */
const hashedPasswordFunction = async (data) => {
    // Generate a salt using the configured salt rounds from environment variables
    let salt = await bcrypt.genSalt(+process.env.SALT);
    
    // Hash the plain text password with the generated salt
    let hashPassword = await bcrypt.hash(data, salt);
    
    // Return the hashed password
    return hashPassword;
}

// Exporting the hashedPasswordFunction for use in other parts of the application
module.exports = { hashedPasswordFunction };
