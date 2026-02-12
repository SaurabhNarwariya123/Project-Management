const express = require('express');
const { body } = require('express-validator');
const {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment,
  likeComment,
  replyToComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Create comment
router.post(
  '/:taskId/comments',
  protect,
  [body('text').trim().notEmpty().withMessage('Comment text is required')],
  validate,
  createComment
);

// Get comments by task
router.get('/:taskId/comments', protect, getCommentsByTask);

// Update comment
router.put(
  '/comment/:commentId',
  protect,
  [body('text').trim().notEmpty().withMessage('Comment text is required')],
  validate,
  updateComment
);

// Delete comment
router.delete('/comment/:commentId', protect, deleteComment);

// Like comment
router.post('/comment/:commentId/like', protect, likeComment);

// Reply to comment
router.post(
  '/comment/:commentId/reply',
  protect,
  [body('text').trim().notEmpty().withMessage('Reply text is required')],
  validate,
  replyToComment
);

module.exports = router;
