const UserModel = require("../models/user.model");
const { validationResult } = require("express-validator");  
const { hashedPasswordFunction } = require("../middlewares/hashedPassword");
const comparePassword = require("../middlewares/comparePassword");
const { generateToken } = require("../tokens/token");
const { STATUS_CODES, MESSAGES } = require("../constants/user.constant"); 

// User signup controller
const signup = async (req, res) => {
    try {
        // Validate request inputs
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ errors: errors.array() });
        }
  
        const { name, email, password } = req.body;
        // Ensure all fields are provided
        if (!name || !email || !password) {
            return res.status(STATUS_CODES.BAD_REQUEST).send({ error: MESSAGES.ALL_FIELDS_REQUIRED });
        }
  
        // Check if user already exists
        const exists = await UserModel.findOne({ email });
        if (exists) {
            return res.status(STATUS_CODES.BAD_REQUEST).send({ error: MESSAGES.USER_EXISTS });
        }
  
        // Hash the password before saving
        const hashedPassword = await hashedPasswordFunction(password);
  
        // Create a new user and save to database
        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();
        res.status(STATUS_CODES.CREATED).json({ message: MESSAGES.USER_CREATED, user });
    } catch (error) {
        // Handle server error
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: error.message });
    }
};

// User login controller
const login = async (req, res) => {
    try {            
        // Validate request inputs
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        // Find user by email
        let user = await UserModel.findOne({ email });
        if (user) {
            // Compare provided password with stored password
            const isPasswordMatch = await comparePassword(password, user.password);
            if (!isPasswordMatch) return res.status(STATUS_CODES.BAD_REQUEST).send({ error: MESSAGES.INVALID_PASSWORD }); 
            
            // Generate and set authentication token as a cookie
            const token = await generateToken(user._id);            
            res.cookie('authToken', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // Cookie expires in 1 day
            });
            user = { ...user._doc, password: undefined }; // Remove password from user object
            res.status(STATUS_CODES.SUCCESS).json({ user, message: MESSAGES.LOGIN_SUCCESS });  
        } else {
            return res.status(STATUS_CODES.NOT_FOUND).send({ error: MESSAGES.USER_NOT_FOUND });
        }
    } catch (error) {
        // Handle server error
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: error.message });
    }
};

// Get user by ID controller
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        // Fetch user by ID and exclude password from the response
        const user = await UserModel.findById(id).select('-password');
        if (!user) {
            return res.status(STATUS_CODES.NOT_FOUND).send({ error: MESSAGES.USER_NOT_FOUND });
        }  
        res.status(STATUS_CODES.SUCCESS).send({ message: MESSAGES.USER_FOUND, user });
    } catch (error) {
        // Handle server error
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: error.message });
    }
};

// Edit user details by ID controller
const editUserById = async (req, res) => {      
    try {            
        const { name, email, password, new_password } = req.body;
        const id = req.user; // Get user ID from the authenticated user
        const user = await UserModel.findById(id);  
        if (!user) {
            return res.status(STATUS_CODES.NOT_FOUND).send({ error: MESSAGES.USER_NOT_FOUND });
        }
        // Check if the user wants to update their password
        if (password && new_password) {
            const comparePass = await comparePassword(password, user.password);
            if (!comparePass) {
                return res.status(STATUS_CODES.BAD_REQUEST).send({ error: MESSAGES.INVALID_PASSWORD });
            }
            const hashedNewPassword = await hashedPasswordFunction(new_password);
            user.password = hashedNewPassword; // Update password
        }
        // Update user details
        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();
        res.clearCookie('authToken'); // Clear existing token
        res.status(STATUS_CODES.SUCCESS).send({ message: MESSAGES.USER_UPDATED, user });
    } catch (error) {
        // Handle server error
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: error.message });
    }  
};

// Get all users controller
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users and exclude password from the response
        const users = await UserModel.find().select('email _id');
        if (!users) {
            return res.status(STATUS_CODES.NOT_FOUND).send({ error: MESSAGES.USER_NOT_FOUND });
        } 
        res.status(STATUS_CODES.SUCCESS).json({ users, message: MESSAGES.USERS_RETRIEVED });
    } catch (error) {
        // Handle server error
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: error.message });
    }           
};

// User logout controller
const logout = (req, res) => {
    try {
        res.clearCookie('authToken'); // Clear authentication token
        res.status(STATUS_CODES.SUCCESS).send({ message: MESSAGES.LOGOUT_SUCCESS });
    } catch (error) {
        // Handle server error
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: error.message });
    }
};        

// Export user controller methods
module.exports = {
    signup,
    login,
    getUserById, 
    editUserById, 
    getAllUsers, 
    logout
};