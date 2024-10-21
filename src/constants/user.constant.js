// HTTP status codes used for API responses
const STATUS_CODES = {
    SUCCESS: 200,               // OK
    CREATED: 201,               // Resource created successfully
    BAD_REQUEST: 400,           // Client-side error in the request
    UNAUTHORIZED: 401,          // Authentication required
    FORBIDDEN: 403,             // Access to the resource is forbidden
    NOT_FOUND: 404,             // Resource not found
    SERVER_ERROR: 500           // Internal server error
};

// Messages used in API responses
const MESSAGES = {
    INVALID_TOKEN: 'Invalid token',                      // Error message for an invalid token
    LOGIN_FIRST: "Please login first",                   // Prompt to login before accessing a resource
    USER_CREATED: 'User created successfully',            // Success message for user creation
    LOGIN_SUCCESS: 'Login successful',                    // Success message for user login
    LOGOUT_SUCCESS: 'Logout successful',                  // Success message for user logout
    USER_UPDATED: 'User updated successfully',            // Success message for updating user details
    USER_FOUND: 'User found successfully',                // Success message when user is found
    USER_NOT_FOUND: 'User not found',                     // Error message when a user is not found
    USERS_RETRIEVED: 'Users fetched successfully',        // Success message for fetching users
    INVALID_PASSWORD: 'Invalid Password',                 // Error message for incorrect password
    USER_EXISTS: 'User already exists',                   // Error message when trying to create an existing user
    ALL_FIELDS_REQUIRED: 'All fields are required'        // Error message for missing fields in requests
};

// Export constants for use in other modules
module.exports = {
    STATUS_CODES,
    MESSAGES
};
