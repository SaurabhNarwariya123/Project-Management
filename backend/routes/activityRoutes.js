const express = require('express');
const {
  getActivityLogsByProject,
  getActivityLogsByTask,
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get activity logs by project
router.get('/project/:projectId', protect, getActivityLogsByProject);

// Get activity logs by task
router.get('/task/:taskId', protect, getActivityLogsByTask);

module.exports = router;
