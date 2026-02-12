import api from './api';

// AUTH APIS
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getAllUsers: (params) => api.get('/auth/users', { params }),
  getUserById: (id) => api.get(`/auth/${id}`),
};

// PROJECT APIS
export const projectAPI = {
  createProject: (data) => api.post('/projects', data),
  getProjects: (params) => api.get('/projects', { params }),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  addTeamMember: (projectId, data) => api.post(`/projects/${projectId}/members`, data),
  removeTeamMember: (projectId, data) => api.delete(`/projects/${projectId}/members`, { data }),
};

// TASK APIS
export const taskAPI = {
  createTask: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  getTasksByProject: (projectId, params) => api.get(`/projects/${projectId}/tasks`, { params }),
  getTaskById: (taskId) => api.get(`/projects/task/${taskId}`),
  updateTask: (taskId, data) => api.put(`/projects/task/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/projects/task/${taskId}`),
  assignTask: (taskId, data) => api.post(`/projects/task/${taskId}/assign`, data),
  addWatcher: (taskId, data) => api.post(`/projects/task/${taskId}/watchers`, data),
  removeWatcher: (taskId, data) => api.delete(`/projects/task/${taskId}/watchers`, { data }),
};

// COMMENT APIS
export const commentAPI = {
  createComment: (taskId, data) => api.post(`/tasks/${taskId}/comments`, data),
  getComments: (taskId, params) => api.get(`/tasks/${taskId}/comments`, { params }),
  updateComment: (commentId, data) => api.put(`/tasks/comment/${commentId}`, data),
  deleteComment: (commentId) => api.delete(`/tasks/comment/${commentId}`),
  likeComment: (commentId) => api.post(`/tasks/comment/${commentId}/like`),
  replyToComment: (commentId, data) => api.post(`/tasks/comment/${commentId}/reply`, data),
};

// ACTIVITY APIS
export const activityAPI = {
  getProjectActivity: (projectId, params) => api.get(`/activity/project/${projectId}`, { params }),
  getTaskActivity: (taskId, params) => api.get(`/activity/task/${taskId}`, { params }),
};

// ADMIN APIS
export const adminAPI = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (userId, data) => api.patch(`/admin/users/${userId}/role`, data),
  updateUserStatus: (userId, data) => api.patch(`/admin/users/${userId}/status`, data),
  getProjects: (params) => api.get('/admin/projects', { params }),
  deleteProject: (projectId) => api.delete(`/admin/projects/${projectId}`),
  getActivity: (params) => api.get('/admin/activity', { params }),
};
