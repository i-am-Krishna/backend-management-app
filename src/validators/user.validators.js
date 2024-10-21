// Importing body from express-validator to create validation rules
const { body } = require('express-validator');

// Validation rules for user signup
const signupValidationRules = [
    // Validate 'name' field to ensure it is not empty
    body('name').notEmpty().withMessage('Name is required'),
    
    // Validate 'email' field to ensure it is a valid email address
    body('email').isEmail().withMessage('Please provide a valid email address'),
    
    // Validate 'password' field with multiple conditions
    body('password')
        .isLength({ min: 8, max: 16 }) // Ensure password length is between 8 and 16 characters
        .withMessage('Password must be at least 8 characters long and less than 16 characters long')
        .matches(/[A-Z]/) // Ensure password contains at least one uppercase letter
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/) // Ensure password contains at least one lowercase letter
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/) // Ensure password contains at least one number
        .withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&]/) // Ensure password contains at least one special character
        .withMessage('Password must contain at least one special character (@, $, !, %, *, ?, &)')
];

// Validation rules for user login
const loginValidationRules = [
    // Validate 'email' field to ensure it is a valid email address
    body('email').isEmail().withMessage('Please provide a valid email address'),
    
    // Validate 'password' field to ensure it is not empty and meets length requirements
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 16 }) // Ensure password length is between 8 and 16 characters
        .withMessage('Password must be at least 8 characters long and less than 16 characters long')
];

// Exporting validation rules for use in other parts of the application
module.exports = { signupValidationRules, loginValidationRules };
