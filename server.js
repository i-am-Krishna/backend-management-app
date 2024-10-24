// Importing necessary modules
const app = require("./src/app.js"); // Importing the Express app instance
const dotenv = require("dotenv"); // Importing dotenv for environment variable management
const connectDB = require("./src/database/db.js"); // Importing the database connection module


// Loading environment variables from .env file
dotenv.config();

// Setting the port from environment variables or defaulting to 8000
const port = process.env.PORT || 8000;


// Starting the server and connecting to the database
const startServer = async () => {
    try {
        await connectDB(); // Attempting to connect to the database
        console.log('MongoDB connected'); // Logging success message if connected
        
        app.listen(port, () => {
            console.log(`Backend Management App listening on port ${port}!`); // Logging that the server is running
        });
    } catch (error) {
        console.log(`Error: ${error.message}`); // Logging any connection error
        process.exit(1); // Exit the process if the connection fails
    }
};

startServer(); // Start the server
