const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  getAllUsers,
  getUserById,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
  ],
  validate,
  register
);

// Login
router.post(
  '/login',
  [
    body('identifier').notEmpty().withMessage('Email or username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

// Get current user
router.get('/me', protect, getCurrentUser);

// Update profile
router.put(
  '/profile',
  protect,
  [
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
  ],
  validate,
  updateProfile
);

// Get all users
router.get('/users', protect, getAllUsers);

// Get user by ID
router.get('/:id', protect, getUserById);

module.exports = router;
