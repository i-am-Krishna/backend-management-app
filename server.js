// Importing necessary modules
const app = require("./src/app.js"); // Importing the Express app instance
const dotenv = require("dotenv"); // Importing dotenv for environment variable management
const connectDB = require("./src/database/db.js"); // Importing the database connection module
const { default: mongoose } = require("mongoose");

// Loading environment variables from .env file
dotenv.config();

// Setting the port from environment variables or defaulting to 8000
const port = process.env.PORT || 8000;

// Setting up a basic route for the root URL
app.get("/", (req, res) => {
    res.send("Hello World!"); // Responding with a simple message
});

app.get('/test-db-connection', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        res.send("Connected to MongoDB!");
    } catch (error) {
        res.status(500).send(`Database connection failed: ${error.message}`);
    }
});


// Starting the server and connecting to the database
app.listen(port, async () => {
    try {
        await connectDB(); // Attempting to connect to the database
        console.log('MongoDB connected'); // Logging success message if connected
    } catch (error) {
        console.log(`Error: ${error.message}`); // Logging any connection error
    }
    console.log(`Backend Management App listening on port ${port}!`); // Logging that the server is running
});
