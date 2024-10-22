// Importing required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { STATUS_CODES, MESSAGES } = require("../constants/userconstant.js");

// Load environment variables from .env file
dotenv.config();

// Authentication middleware function
const authentication = (req, res, next) => {
    // Retrieve the token from cookies
    const authHeader = req.cookies["authToken"];

    // Check if the token is missing; if so, respond with unauthorized status
    if (authHeader == null) {
        return res.status(STATUS_CODES.UNAUTHORIZED).send({ message: MESSAGES.LOGIN_FIRST });
    }

    // Verify the token using the secret key
    jwt.verify(authHeader, process.env.JWT_SECRET, (err, user) => {
        // If verification fails, respond with forbidden status
        if (err) {
            return res.status(STATUS_CODES.FORBIDDEN).send({ message: MESSAGES.INVALID_TOKEN });
        }

        // If verification is successful, attach the user ID to the request object
        req.user = user.id;

        // Proceed to the next middleware or route handler
        next();
    });
};

// Exporting the authentication middleware for use in other parts of the application
module.exports = { authentication };
