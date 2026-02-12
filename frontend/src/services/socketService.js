import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initiateSocket = (token) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => {
  return socket;
};

// Socket event emitters
export const socketEmitters = {
  joinProject: (projectId) => {
    if (socket) socket.emit('join-project', projectId);
  },
  leaveProject: (projectId) => {
    if (socket) socket.emit('leave-project', projectId);
  },
  taskCreated: (data) => {
    if (socket) socket.emit('task-created', data);
  },
  taskUpdated: (data) => {
    if (socket) socket.emit('task-updated', data);
  },
  taskStatusChanged: (data) => {
    if (socket) socket.emit('task-status-changed', data);
  },
  commentAdded: (data) => {
    if (socket) socket.emit('comment-added', data);
  },
  userOnline: () => {
    if (socket) socket.emit('user-online');
  },
  userOffline: () => {
    if (socket) socket.emit('user-offline');
  },
};

// Socket event listeners
export const socketListeners = {
  onTaskCreated: (callback) => {
    if (socket) socket.on('task-created-notification', callback);
  },
  onTaskUpdated: (callback) => {
    if (socket) socket.on('task-updated-notification', callback);
  },
  onTaskStatusChanged: (callback) => {
    if (socket) socket.on('task-status-changed-notification', callback);
  },
  onCommentAdded: (callback) => {
    if (socket) socket.on('comment-added-notification', callback);
  },
  onUserJoined: (callback) => {
    if (socket) socket.on('user-joined', callback);
  },
  onUserLeft: (callback) => {
    if (socket) socket.on('user-left', callback);
  },
  onUserOnline: (callback) => {
    if (socket) socket.on('user-online', callback);
  },
  onUserOffline: (callback) => {
    if (socket) socket.on('user-offline', callback);
  },
};
