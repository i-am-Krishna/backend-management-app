// Importing necessary modules
const express = require("express"); // Importing Express framework
const cors = require("cors"); // Importing CORS middleware
const morgan = require("morgan"); // Importing HTTP request logger middleware
const rateLimit = require("express-rate-limit"); // Importing rate limiting middleware
const userRouter = require("./routes/user.routes.js"); // Importing user routes
const taskRouter = require("./routes/task.routes.js"); // Importing task routes
const cookieParser = require("cookie-parser"); // Importing cookie parser middleware
const mongoose = require("mongoose"); // Importing mongoose
const dotenv = require("dotenv"); // Importing dotenv for environment variable management

dotenv.config();



// Creating an instance of the Express application
const app = express();

// Setting up rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // Time frame for requests in milliseconds (1 minute)
  max: 20, // Maximum number of requests allowed per windowMs
  standardHeaders: true, // Send rate limit info in the 'RateLimit-*' headers
  legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
});
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // Allows credentials (cookies) to be sent
}));

app.use(limiter);

// console.log(process.env.COOKIE_SECRET);
app.use(cookieParser()); // Initialize cookie-parser with a secret key

app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse incoming requests with URL-encoded payloads

app.use(morgan("dev")); // Log HTTP requests in 'dev' format


// Setting up a basic route for the root URL
app.get("/", (req, res) => {
  try {
    res.status(200).send({message:"Hello World!"}); // Responding with a simple message
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Test route for database connection
app.get('/test-db-connection', async (req, res) => {
  try {
      // Check if already connected to avoid multiple connections
      if (mongoose.connection.readyState === 1) {
          return res.status(200).json({message:"Already connected to MongoDB!"});
      }
      
      await mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      res.send("Connected to MongoDB!");
  } catch (error) {
      res.status(500).send(`Database connection failed: ${error.message}`);
  }
});


// Setting up route prefixes
app.use("/api/v1/user", userRouter); // Routes for user-related actions
app.use("/api/v1/task", taskRouter); // Routes for task-related actions

// Handling 404 errors (Route not found)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not exists' }); // Respond with a 404 error if no routes match
});

// Generic error handler
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({ error: 'Something went wrong!' }); // Respond with a generic error message
});

// Exporting the app for use in other files
module.exports = app;
