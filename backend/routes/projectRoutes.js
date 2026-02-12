const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Create project
router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').optional().trim(),
  ],
  validate,
  createProject
);

// Get all projects
router.get('/', protect, getProjects);

// Get project by ID
router.get('/:id', protect, getProjectById);

// Update project
router.put(
  '/:id',
  protect,
  [
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim(),
  ],
  validate,
  updateProject
);

// Delete project
router.delete('/:id', protect, deleteProject);

// Add team member
router.post(
  '/:id/members',
  protect,
  [body('userId').notEmpty().withMessage('User ID is required')],
  validate,
  addTeamMember
);

// Remove team member
router.delete('/:id/members', protect, removeTeamMember);

module.exports = router;
