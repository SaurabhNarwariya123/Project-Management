const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  addWatcher,
  removeWatcher,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Create task
router.post(
  '/:projectId/tasks',
  protect,
  [body('title').trim().notEmpty().withMessage('Task title is required')],
  validate,
  createTask
);

// Get tasks by project
router.get('/:projectId/tasks', protect, getTasksByProject);

// Get task by ID
router.get('/task/:taskId', protect, getTaskById);

// Update task
router.put('/task/:taskId', protect, updateTask);

// Delete task
router.delete('/task/:taskId', protect, deleteTask);

// Assign task
router.post('/task/:taskId/assign', protect, assignTask);

// Add watcher
router.post('/task/:taskId/watchers', protect, addWatcher);

// Remove watcher
router.delete('/task/:taskId/watchers', protect, removeWatcher);

module.exports = router;
