const express = require('express');
const {
  getUsers,
  updateUserRole,
  updateUserStatus,
  getProjects,
  deleteProjectByAdmin,
  getActivityLogs,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('Admin'));

// Users
router.get('/users', getUsers);
router.patch('/users/:userId/role', updateUserRole);
router.patch('/users/:userId/status', updateUserStatus);

// Projects
router.get('/projects', getProjects);
router.delete('/projects/:projectId', deleteProjectByAdmin);

// Activity logs
router.get('/activity', getActivityLogs);

module.exports = router;
