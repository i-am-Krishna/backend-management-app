# backend-management-app
Backend Management App


This is a **Task Management System** built using **Node.js**, **Express**, and **MongoDB**. It allows users to create, assign, edit, and track tasks. The system features user authentication, task ownership management, and error handling.

## Features

- User Registration and Login with JWT authentication
- Task creation, assignment, and management
- Password hashing and validation
- Role-based task ownership and assignment
- Error handling for various scenarios (404, 403, 500)
- Secure password storage using `bcrypt`
- Session handling using cookies
- User-friendly API responses

---

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [User Endpoints](#user-endpoints)
  - [Task Endpoints](#task-endpoints)
- [Project Structure](#project-structure)
- [Middleware](#middleware)
- [Error Handling](#error-handling)
- [License](#license)

---

## Installation

 # 1. Clone the repository:

 - git clone https://github.com/your-username/task-management-system.git


 # 2. Install dependencies:
   
 - cd task-management-system
   npm install


# 3. Create a .env file in the root directory and configure the following environment variables:

- PORT = 3000
- MONGO_DB_URL = "your mongodb url"
- DATABASE_NAME = "your database name"
- MIGRATION_DB = "your migration mongodb url"
- JWT_SECRET = "jwt secret key"
- EXPIRES_IN = "expiry date"
- SALT = "your salt number"


# 4. Run the server:

 - node --watch src/server.js


# 5. API Endpoints 

  # Hello world
  - GET / Get "Hello world" from base URL

   
  # User Endpoints
   - Method	Endpoint	Description
   - POST	/api/users/signup	Register a new user
   - POST	/api/users/login	Login with email and password
   - GET	/api/users/:id	Get user details by ID Required
   - PUT	/api/users/edit	Edit user profile and password Required
   - GET	/api/users	Get all registered users (email, ID) Required
   - POST	/api/users/logout	Logout user and clear cookies Required
   

   # Task Endpoints        
   - GET	/tasks	Fetch all tasks	Required
   - GET	/tasks/count	Get task counts	Required
   - GET	/tasks/:id	Get a task by its ID	Not Required
   - POST	/tasks	Add a new task	Required
   - POST	/tasks/assign-all/:id	Assign all tasks to a specific user	Required
   - PATCH	/tasks/:id	Update task status	Required
   - PATCH	/tasks/update/:taskId	Update a task	Required
   - PATCH	/tasks/:taskId/:subtaskId	Update a checklist item	Required
   - DELETE	/tasks/:id	Delete a task	Required
   - DELETE	/tasks/:taskId/:subtaskId	Delete a subtask	Required
   - Feel free to modify any descriptions or details as needed!
- 
  # Not Found
   - Route not found (I am added a router if user gone not defined route then it shows route not exits)


# 6 Project Structure

  - /backend-management-app
-   ├── /node_modules         # Installed dependencies
-   ├── /controllers          # Route controller functions
-   │   └── user.controller.js
-   │   └── task.controller.js
-   ├── /middlewares          # Custom middlewares (e.g., authentication, validation)
-   │   └── auth.js
-   │   └── hashedPassword.js
-   ├── /models               # Mongoose schema models
-   │   └── user.model.js
-   │   └── task.model.js
-   ├── /routes               # Route files
-   │   └── userRoutes.js
-   │   └── taskRoutes.js
-   ├── app.js                # Main server file
-   ├── package.json          # NPM package file
-   ├── .env                  # Environment variables file
-   └── README.md             # Documentation




# 7 Middleware
auth.js: Middleware for checking JWT tokens and ensuring users are authenticated.
hashedPassword.js: Middleware for hashing and comparing passwords using bcrypt.
validation.js: Middleware for validating request bodies using express-validator.


# 8 Error Handling
404 Route Not Found: If the requested route does not exist, the server responds with a 404 Not Found error.
500 Internal Server Error: General error handler for unhandled exceptions.
403 Forbidden: Access denied errors for unauthorized actions.





# License

    
### Key Sections:
- **Installation**: Detailed instructions on how to set up the project on a local machine.
- **Environment Variables**: Lists the necessary environment variables and their purpose.
- **API Endpoints**: A table of the available API endpoints, categorized by user and task operations.
- **Project Structure**: Explains the folder structure of your project.
- **Middleware**: Summarizes the different middleware functions used in the application.
- **Error Handling**: Describes how different errors are handled, like `404`, `500`, and `403`.

You can adjust the content based on your application's specific details, but this should give a solid foundation for documenting your app!
