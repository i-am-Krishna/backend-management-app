// Importing the express library to create the router
const express = require('express');
// Creating a router instance for user-related routes
const userRouter = express.Router();
// Importing the user controller that contains the business logic
const userController = require('../controllers/user.controller.js');
// Importing validation rules for user data
const validation = require('../validators/user.validators.js');
// Importing the authentication middleware to protect certain routes
const { authentication } = require('../middlewares/authentication.js');

// Route for user login with validation rules applied
userRouter.post('/login', validation.loginValidationRules, userController.login);

// Route for user signup with validation rules applied
userRouter.post('/signup', validation.signupValidationRules, userController.signup);

// Route to get all users; protected by authentication middleware
userRouter.get('/', authentication, userController.getAllUsers);

// Route to get a specific user by ID; protected by authentication middleware
userRouter.get('/:id', authentication, userController.getUserById);

// Route to update a user's details by ID; protected by authentication middleware
userRouter.patch('/:id', authentication, userController.editUserById);

// Route for user logout; protected by authentication middleware
userRouter.post('/logout', authentication, userController.logout);


userRouter.get('/check-auth', userController.isAuthenticated);


// Exporting the user router for use in the main application
module.exports = userRouter;
