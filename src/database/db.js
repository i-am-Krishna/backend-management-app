const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database using Mongoose.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the connection string from environment variables
        const conn = await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true, // Use the new URL string parser
            useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
        }); 
        
        // Log the host of the connected MongoDB instance
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {            
        // Log the error message if the connection fails
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Exit the process with a failure code
        process.exit(1);
    }
};  

// Handle graceful exit on app termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});

// Export the connectDB function for use in other parts of the application
module.exports = connectDB;
