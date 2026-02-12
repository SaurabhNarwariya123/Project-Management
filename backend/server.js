const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');
const activityRoutes = require('./routes/activityRoutes');
const adminRoutes = require('./routes/adminRoutes');

const { verifyToken } = require('./utils/jwt');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const ensureAdminUser = async () => {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const email = process.env.ADMIN_EMAIL || 'admin@local';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const firstName = process.env.ADMIN_FIRST_NAME || 'Admin';
  const lastName = process.env.ADMIN_LAST_NAME || 'User';

  const existing = await User.findOne({ $or: [{ email }, { username }] });

  if (!existing) {
    await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role: 'Admin',
    });
    return;
  }

  if (existing.role !== 'Admin') {
    existing.role = 'Admin';
    await existing.save();
  }
};

// Socket.io middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return next(new Error('Authentication error'));
  }

  socket.userId = decoded.id;
  next();
});

// Socket.io events
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected with socket ID: ${socket.id}`);

  // User joined project
  socket.on('join-project', (projectId) => {
    socket.join(`project-${projectId}`);
    io.to(`project-${projectId}`).emit('user-joined', {
      userId: socket.userId,
      timestamp: new Date(),
    });
  });

  // User left project
  socket.on('leave-project', (projectId) => {
    socket.leave(`project-${projectId}`);
    io.to(`project-${projectId}`).emit('user-left', {
      userId: socket.userId,
      timestamp: new Date(),
    });
  });

  // Task created
  socket.on('task-created', (data) => {
    io.to(`project-${data.projectId}`).emit('task-created-notification', data);
  });

  // Task updated
  socket.on('task-updated', (data) => {
    io.to(`project-${data.projectId}`).emit('task-updated-notification', data);
  });

  // Task status changed
  socket.on('task-status-changed', (data) => {
    io.to(`project-${data.projectId}`).emit('task-status-changed-notification', data);
  });

  // Comment added
  socket.on('comment-added', (data) => {
    io.to(`project-${data.projectId}`).emit('comment-added-notification', data);
  });

  // User online status
  socket.on('user-online', () => {
    socket.broadcast.emit('user-online', { userId: socket.userId });
  });

  socket.on('user-offline', () => {
    socket.broadcast.emit('user-offline', { userId: socket.userId });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
    socket.broadcast.emit('user-offline', { userId: socket.userId });
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', taskRoutes);
app.use('/api/tasks', commentRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Server startup
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await ensureAdminUser();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

module.exports = { app, io };
