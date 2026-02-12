# ProjectHub Backend

Express.js based REST API for the ProjectHub project management platform with MongoDB and Socket.io.

## Features

- JWT Authentication
- Role-based Authorization
- Project Management
- Task Management
- Comments and Collaboration
- Activity Logging
- Real-time Updates with Socket.io
- Input Validation
- Error Handling

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Document database
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/project-management
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Run Server
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Routes

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (Protected)
- `PUT /profile` - Update profile (Protected)
- `GET /users` - Get all users
- `GET /:id` - Get user by ID

### Projects (`/api/projects`)
- `POST /` - Create project
- `GET /` - Get all projects
- `GET /:id` - Get project details
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project
- `POST /:id/members` - Add team member
- `DELETE /:id/members` - Remove team member

### Tasks (`/api/projects`)
- `POST /:projectId/tasks` - Create task
- `GET /:projectId/tasks` - Get project tasks
- `GET /task/:taskId` - Get task details
- `PUT /task/:taskId` - Update task
- `DELETE /task/:taskId` - Delete task
- `POST /task/:taskId/assign` - Assign task
- `POST /task/:taskId/watchers` - Add watcher
- `DELETE /task/:taskId/watchers` - Remove watcher

### Comments (`/api/tasks`)
- `POST /:taskId/comments` - Create comment
- `GET /:taskId/comments` - Get comments
- `PUT /comment/:commentId` - Update comment
- `DELETE /comment/:commentId` - Delete comment
- `POST /comment/:commentId/like` - Like comment
- `POST /comment/:commentId/reply` - Reply to comment

### Activity (`/api/activity`)
- `GET /project/:projectId` - Get project activity
- `GET /task/:taskId` - Get task activity

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/             # Business logic
│   ├── authController.js
│   ├── projectController.js
│   ├── taskController.js
│   ├── commentController.js
│   └── activityController.js
├── middleware/              # Custom middleware
│   ├── auth.js             # JWT & role verification
│   ├── errorHandler.js     # Global error handler
│   └── validation.js       # Input validation
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── Project.js
│   ├── Task.js
│   ├── Comment.js
│   └── ActivityLog.js
├── routes/                 # API routes
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   ├── commentRoutes.js
│   └── activityRoutes.js
├── services/              # External services
├── utils/                 # Utility functions
│   ├── jwt.js
│   └── errorHandler.js
├── .env.example          # Environment template
├── .gitignore
├── package.json
└── server.js             # Main entry point
```

## Middleware

### Authentication (`protect`)
Verifies JWT token and adds user info to request

### Authorization (`authorize`)
Checks user role against required roles

### Validation (`validate`)
Validates request body using express-validator

### Error Handler
Global error handling middleware

## Database Models

### User
- Complete user profile management
- Role-based access
- Online status tracking

### Project
- Project hierarchy
- Team management
- Status tracking
- Visibility control

### Task
- Task details and metadata
- Priority and status
- Assignment tracking
- Watchers and followers

### Comment
- Task comments
- User mentions
- Replies and likes

### ActivityLog
- Action tracking
- Change history
- User activity trail

## Socket Events

### Client to Server
- `join-project` - Join project room
- `leave-project` - Leave project room
- `task-created` - Broadcast new task
- `task-updated` - Broadcast task update
- `task-status-changed` - Broadcast status change
- `comment-added` - Broadcast new comment
- `user-online` - Set user online
- `user-offline` - Set user offline

### Server to Client
- `task-created-notification`
- `task-updated-notification`
- `task-status-changed-notification`
- `comment-added-notification`
- `user-joined`
- `user-left`
- `user-online`
- `user-offline`

## Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db-name

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Optional
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## Error Handling

The API uses standard HTTP status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

Error response format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- JWT token-based authentication
- Password hashing with bcryptjs (10 salt rounds)
- Input validation and sanitization
- Protected API routes
- Role-based access control
- CORS protection
- Secure error messages

## Performance Optimization

- Database indexing on frequently queried fields
- Pagination support
- Query optimization
- Field selection to reduce payload

## Best Practices

- Input validation on all endpoints
- Permission checks before operations
- Activity logging for audit trail
- Error handling with meaningful messages
- RESTful API design

## Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "dotenv": "^16.3.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "socket.io": "^4.7.2",
  "cors": "^2.8.5",
  "express-validator": "^7.0.0"
}
```

## Running Tests

```bash
npm test
```

## Deployment

### On Render.com
1. Connect GitHub repository
2. Set environment variables
3. Set start command: `npm start`
4. Deploy

### On Railway.app
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### On Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```

## Troubleshooting

### MongoDB Connection Error
- Verify MONGODB_URI is correct
- Check IP whitelist on MongoDB Atlas
- Ensure credentials are URL-encoded

### JWT Errors
- Check JWT_SECRET is set
- Verify token format in Authorization header
- Ensure token is not expired

### Socket Connection Issues
- Verify CORS settings
- Check frontend socket URL matches backend
- Ensure Socket.io port is accessible

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT License - see LICENSE file for details
