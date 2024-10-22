const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database using Mongoose.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the connection string from environment variables
        const conn = await mongoose.connect(`${process.env.MONGO_DB_URL}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }); 
        
        // Log the host of the connected MongoDB instance
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {            
        // Log the error message if the connection fails
        console.error(error.message);
        // Exit the process with a failure code
        process.exit(1);
    }
};  

// Export the connectDB function for use in other parts of the application
module.exports = connectDB;
