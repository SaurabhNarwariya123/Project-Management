import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export const useProjectStore = create((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updatedProject) =>
    set((state) => ({
      projects: state.projects.map((p) => (p._id === id ? updatedProject : p)),
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p._id !== id),
    })),
}));

export const useTaskStore = create((set) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),
  setCurrentTask: (task) => set({ currentTask: task }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t._id === id ? updatedTask : t)),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== id),
    })),
}));

export const useNotificationStore = create((set) => ({
  notifications: [],
  onlineUsers: [],

  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  addOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: [...new Set([...state.onlineUsers, userId])],
    })),
  removeOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((u) => u !== userId),
    })),
}));
