// Importing necessary libraries
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// Loading environment variables from the .env file
dotenv.config();


const hashedPasswordFunction = async (data) => {
    // Generate a salt using the configured salt rounds from environment variables
    let salt = await bcrypt.genSalt(+process.env.SALT);
    
    // Hash the plain text password with the generated salt
    return await bcrypt.hash(data, salt);
    
    // Return the hashed password
}

// Exporting the hashedPasswordFunction for use in other parts of the application
module.exports = { hashedPasswordFunction };
