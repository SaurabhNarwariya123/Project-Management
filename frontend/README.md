# ProjectHub Frontend

React.js based frontend application for the ProjectHub project management platform with real-time updates using Socket.io.

## Features

- User Authentication (Login/Register)
- Project Dashboard
- Project Management
- Task Management
- Real-time Notifications
- Comments & Collaboration
- Activity Tracking
- Responsive Design
- Dark/Light Theme Ready

## Tech Stack

- **React 18** - UI Framework
- **React Router v6** - Routing
- **Zustand** - State Management
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client
- **Socket.io Client** - Real-time Updates
- **React Icons** - Icons
- **React Hot Toast** - Notifications

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your API URLs:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 3. Run Development Server
```bash
npm start
```

The app will open automatically on `http://localhost:3000`

## Project Structure

```
frontend/src/
├── components/              # Reusable components
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── Cards.jsx
│   └── States.jsx
├── pages/                   # Page components
│   ├── AuthPages.jsx        # Login & Register
│   ├── Dashboard.jsx
│   ├── ProjectsPage.jsx
│   ├── ProjectDetailPage.jsx
│   └── TaskDetailPage.jsx
├── context/                 # Zustand stores
│   └── store.js
├── services/                # API & Socket services
│   ├── api.js               # Axios config
│   ├── apiService.js        # API endpoints
│   └── socketService.js     # Socket.io setup
├── styles/                  # Global styles
│   └── index.css
├── utils/                   # Helper functions
│   └── helpers.js
├── App.jsx                  # Main app component
└── index.js                 # Entry point
```

## Components

### Navbar
Navigation bar with user menu and logout functionality

### ProtectedRoute
Wrapper for routes that require authentication

### Cards
- TaskCard - Display task information
- ProjectCard - Display project information

### States
- LoadingSpinner - Loading indicator
- ErrorMessage - Error display
- EmptyState - Empty list placeholder

## Pages

### AuthPages
- **LoginPage** - User login form
- **RegisterPage** - User registration form

### Dashboard
Main dashboard showing:
- Project statistics
- Recent projects
- Recent tasks
- Quick task filtering

### ProjectsPage
- List all projects
- Create new project modal
- Search and filter projects
- Delete projects
- View project details

### ProjectDetailPage
- Project details and statistics
- Task list with filtering
- Create new task modal
- Edit/delete tasks
- Team member management

### TaskDetailPage
- Task details and metadata
- Status and priority management
- Comments section
- Activity log
- Task updates

## State Management (Zustand)

### useAuthStore
```javascript
{
  user,           // Current user object
  token,          // JWT token
  isLoading,      // Loading state
  error,          // Error message
  setUser,        // Set user
  setToken,       // Set token
  setLoading,     // Set loading state
  setError,       // Set error
  logout          // Logout user
}
```

### useProjectStore
```javascript
{
  projects,       // List of projects
  currentProject, // Currently viewed project
  isLoading,
  error,
  setProjects,
  setCurrentProject,
  setLoading,
  setError,
  addProject,
  updateProject,
  deleteProject
}
```

### useTaskStore
```javascript
{
  tasks,          // List of tasks
  currentTask,    // Currently viewed task
  isLoading,
  error,
  setTasks,
  setCurrentTask,
  setLoading,
  setError,
  addTask,
  updateTask,
  deleteTask
}
```

### useNotificationStore
```javascript
{
  notifications,  // List of notifications
  onlineUsers,    // Online users list
  addNotification,
  removeNotification,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser
}
```

## Services

### API Service (apiService.js)
Organized API calls by feature:
- `authAPI` - Authentication endpoints
- `projectAPI` - Project endpoints
- `taskAPI` - Task endpoints
- `commentAPI` - Comment endpoints
- `activityAPI` - Activity endpoints

### Socket Service (socketService.js)
- `initiateSocket()` - Connect to socket server
- `disconnectSocket()` - Disconnect from server
- `getSocket()` - Get socket instance
- `socketEmitters` - Emit events
- `socketListeners` - Listen to events

### API Instance (api.js)
Axios instance with:
- Automatic token insertion
- Error handling
- Request/response interceptors

## Helper Functions

### Date Helpers
- `formatDate()` - Format date to readable string
- `formatTime()` - Format time
- `formatDateTime()` - Format date and time
- `getRelativeTime()` - Get relative time (e.g., "2h ago")

### UI Helpers
- `getPriorityColor()` - Get priority badge color
- `getStatusColor()` - Get status badge color
- `getInitials()` - Get user initials
- `truncateText()` - Truncate long text

## Routing

```
/                           -> Redirect to /dashboard
/login                      -> Login page
/register                   -> Register page
/dashboard                  -> Main dashboard (Protected)
/projects                   -> Projects list (Protected)
/project/:projectId         -> Project details (Protected)
/task/:taskId               -> Task details (Protected)
```

## Environment Variables

```env
# API
REACT_APP_API_URL=http://localhost:5000/api

# Socket.io
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Authentication Flow

1. User registers/logs in
2. Backend returns JWT token
3. Token saved to localStorage
4. Token added to all API requests
5. Socket connection established with token
6. User redirected to dashboard

## Real-Time Features

### Socket Events Handled
- `user-joined` - User joined project
- `user-left` - User left project
- `task-created-notification` - New task created
- `task-updated-notification` - Task updated
- `task-status-changed-notification` - Task status changed
- `comment-added-notification` - Comment added
- `user-online` - User came online
- `user-offline` - User went offline

## Build & Deployment

### Build for Production
```bash
npm run build
```

Creates optimized production build in `build/` directory

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

## Styling

Global styles in `src/styles/index.css` with:
- Tailwind CSS utilities
- Custom animations
- Scrollbar styling
- Custom fonts (Inter from Google Fonts)

Tailwind configuration in `tailwind.config.js` with:
- Custom color palette
- Theme extensions
- Plugin configurations

## Performance Optimization

- Code splitting with React Router
- Lazy loading components
- Image optimization
- CSS optimization with Tailwind
- Zustand for efficient state management

## Error Handling

- Global error boundaries
- Toast notifications for user feedback
- API error interceptors
- User-friendly error messages

## Responsiveness

- Mobile-first design
- Breakpoints: sm, md, lg, xl
- Flexible grid layouts
- Touch-friendly buttons
- Mobile navigation menu

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.16.0",
  "axios": "^1.5.0",
  "socket.io-client": "^4.7.2",
  "tailwindcss": "^3.3.3",
  "zustand": "^4.4.2",
  "react-icons": "^4.12.0",
  "react-hot-toast": "^2.4.1"
}
```

## Development

### ESLint & Prettier (Optional)
```bash
npm install --save-dev eslint prettier eslint-config-prettier
```

### Testing (Optional)
```bash
npm test
```

## Troubleshooting

### API Connection Error
- Verify REACT_APP_API_URL is correct
- Check if backend server is running
- Check browser console for errors

### Socket Connection Error
- Verify REACT_APP_SOCKET_URL is correct
- Check CORS settings on backend
- Ensure authentication token is valid

### JWT Token Expired
- Auto-redirects to login page
- Token cleared from localStorage
- User prompted to login again

### Styling Issues
- Clear Tailwind cache: `npm run build`
- Verify tailwind.config.js is correct
- Check CSS imports in components

## Code Quality

- ES6+ JavaScript
- Functional components with hooks
- Custom hooks for reusable logic
- Proper error handling
- Input validation
- Clean code principles

## Performance Tips

- Use React DevTools Profiler
- Monitor network requests
- Lazy load heavy components
- Optimize images
- Minimize re-renders with Zustand

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT License - see LICENSE file for details
