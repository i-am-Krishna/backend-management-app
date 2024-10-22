// Importing necessary modules
const express = require("express"); // Importing Express framework
const cors = require("cors"); // Importing CORS middleware
const morgan = require("morgan"); // Importing HTTP request logger middleware
const rateLimit = require("express-rate-limit"); // Importing rate limiting middleware
const userRouter = require("./routes/user.routes.js"); // Importing user routes
const taskRouter = require("./routes/task.routes.js"); // Importing task routes
const cookieParser = require("cookie-parser"); // Importing cookie parser middleware

// Creating an instance of the Express application
const app = express();

// Setting up rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // Time frame for requests in milliseconds (1 minute)
  max: 20, // Maximum number of requests allowed per windowMs
  standardHeaders: true, // Send rate limit info in the 'RateLimit-*' headers
  legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
});

// Applying middlewares

//app.use(limiter); // Apply rate limiting middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse incoming requests with URL-encoded payloads
app.use(morgan("dev")); // Log HTTP requests in 'dev' format
app.use(cookieParser()); // Parse cookies in incoming requests

// Setting up route prefixes
app.use("/api/v1/user", userRouter); // Routes for user-related actions
app.use("/api/v1/task", taskRouter); // Routes for task-related actions


// Handling 404 errors (Route not found)
// app.use((req, res, next) => {
//   res.status(404).json({ error: 'Route not exists' }); // Respond with a 404 error if no routes match
// });

// Exporting the app for use in other files
module.exports = app; 
