# Task Management API

## Overview
This is a secure and scalable Task Management System API built using Node.js, Express, TypeScript, PostgreSQL, and Sequelize ORM. The API supports user authentication, task management, notifications, and logging while maintaining security and performance best practices.

## Features
- **User Authentication and Authorization:** JWT-based authentication with role-based access control (Admin & User).
- **Task Management:** Users can create, update, delete, and assign tasks.
- **Task Status Management:** Users can update the status of their tasks, while Admins can update any task.
- **Notifications:** Users receive notifications when tasks are assigned, updated, or due soon.
- **Logging & Auditing:** Tracks task changes, including user actions and timestamps.
- **Security & Performance:** Implements rate limiting, input validation, and optimized database queries.
- **Testing & CI/CD:** Includes unit and integration tests with Jest and a setup for continuous integration.

---

## Tech Stack
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL, Sequelize ORM, Sequelize Migrations
- **Authentication:** JSON Web Tokens (JWT), bcrypt for password hashing
- **Validation & Security:** Express Validator, Helmet, CORS, Express Rate Limit
- **Logging:** Winston
- **Testing:** Jest, Supertest
- **Task Scheduling:** Node-cron

---

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (>= 18.x)
- PostgreSQL (configured with a database)
- npm or yarn

### Clone the Repository
```sh
git clone https://github.com/CodingStarMannu/Task_Management.git
cd task-management-api
```

### Install Dependencies
```sh
npm install
```

### Environment Variables
Create a `.env` file in the root directory and configure the following:
```
DB_NAME= "YOURDBNAME"
DB_USER="postgres"
DB_PASSWORD="YOURPASSWORD"
DB_HOST="localhost"
DB_PORT=5432
PORT=4000
JWT_SECRET ="mysupersecretkey"
SMTP_MAIL = "YOURMAIL@GMAIL.COM"
SMTP_PASSWORD = "YOURPASSWORD" 
SMTP_HOST = "smtp.gmail.com",
SMTP_PORT = 465
ENABLE_EMAIL_NOTIFICATIONS= "true"
NODE_ENV = "development"
```

---

## Database Setup
### Run Migrations
```sh
npm run migrate
```

### Seed the Database (Optional)
```sh
npm run seed
```

### Undo Migrations (If needed)
```sh
npm run migrate:undo
```

---

## Running the Application
### Development Mode
```sh
npm run start:dev
```

### Production Mode
```sh
npm run start:prod
```

---

## API Endpoints
### **Auth Routes**
| Method | Endpoint             | Description          |
|--------|----------------------|----------------------|
| POST   | /api/auth/register   | Register a new user |
| POST   | /api/auth/login      | User login          |

### **User Routes**
| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | /api/users/profile  | Get user profile    |

### **Task Routes**
| Method  | Endpoint                        | Description                   |
|---------|---------------------------------|-------------------------------|
| POST    | /api/tasks/createTask           | Create a new task            |
| PUT     | /api/tasks/updateTask/:taskId   | Update an existing task      |
| PATCH   | /api/tasks/updateTaskStatus/:taskId | Update task status    |
| DELETE  | /api/tasks/deleteTask/:taskId   | Delete a task                |
| GET     | /api/tasks                      | Get all tasks (Admin only)   |

---

## Testing
Run the test suite using Jest:
```sh
npm test
```
Run tests in watch mode:
```sh
npm run test:watch
```

---

## Logging & Auditing
The system logs all actions related to task creation, updates, and deletions. Logs are stored using Winston.

---

## Security Features
- **JWT Authentication** to ensure secure access to the API.
- **Bcrypt Password Hashing** for secure user credentials storage.
- **Input Validation** using Express Validator to prevent invalid data submission.
- **Rate Limiting** to protect against DDoS attacks.
- **Helmet & CORS** to enhance API security.

---

## Deployment
To deploy the API:
1. Set up a PostgreSQL database.
2. Configure environment variables.
3. Build the application:
   ```sh
   npm run build
   ```
4. Start the server:
   ```sh
   npm run start:prod
   ```

---

## Future Improvements
- Implement WebSockets for real-time notifications.
- Add more granular permission levels.
- Implement caching with Redis.

---

## Author
Manoj Pant

---

## License
This project is licensed under the ISC License.

