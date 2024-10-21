// Importing bcryptjs library for password hashing and comparison
const bcrypt = require("bcryptjs");

/**
 * Compares a plain text password with a hashed password.
 * @param {string} password - The plain text password to be compared.
 * @param {string} matchPassword - The hashed password to be checked against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
 */
const comparePassword = async (password, matchPassword) => {
    // Compare the plain text password with the hashed password
    let hashPassword = await bcrypt.compare(password, matchPassword);
    
    // Return the result of the comparison (true or false)
    return hashPassword;
}

// Exporting the comparePassword function for use in other parts of the application
module.exports = comparePassword;
