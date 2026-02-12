const Comment = require('../models/Comment');
const Task = require('../models/Task');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const CustomError = require('../utils/errorHandler');

// Create comment
const createComment = async (req, res, next) => {
  try {
    const { text, mentions } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return next(new CustomError('Task not found', 404));
    }

    let comment = await Comment.create({
      text,
      task: req.params.taskId,
      author: req.user.id,
      mentions: mentions || [],
    });

    comment = await comment.populate('author', 'username email firstName lastName profileImage');
    comment = await comment.populate('mentions', 'username email firstName lastName');

    task.comments.push(comment._id);
    await task.save();

    // Create activity log
    await ActivityLog.create({
      project: task.project,
      task: task._id,
      user: req.user.id,
      action: 'comment_added',
      description: `${req.user.username} commented on task "${task.title}"`,
    });

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    next(error);
  }
};

// Get comments by task
const getCommentsByTask = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({ task: req.params.taskId })
      .populate('author', 'username email firstName lastName profileImage')
      .populate('mentions', 'username email firstName lastName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments({ task: req.params.taskId });

    res.status(200).json({
      success: true,
      comments,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// Update comment
const updateComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    let comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(new CustomError('Comment not found', 404));
    }

    // Check authorization
    if (comment.author.toString() !== req.user.id) {
      return next(new CustomError('Not authorized to update this comment', 403));
    }

    comment.text = text;
    await comment.save();

    comment = await comment.populate('author', 'username email firstName lastName profileImage');

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    next(error);
  }
};

// Delete comment
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(new CustomError('Comment not found', 404));
    }

    // Check authorization
    if (comment.author.toString() !== req.user.id) {
      return next(new CustomError('Not authorized to delete this comment', 403));
    }

    const task = await Task.findById(comment.task);
    task.comments = task.comments.filter((c) => c.toString() !== req.params.commentId);
    await task.save();

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Add like to comment
const likeComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(new CustomError('Comment not found', 404));
    }

    if (comment.likes.includes(req.user.id)) {
      comment.likes = comment.likes.filter((like) => like.toString() !== req.user.id);
    } else {
      comment.likes.push(req.user.id);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    next(error);
  }
};

// Reply to comment
const replyToComment = async (req, res, next) => {
  try {
    const { text, mentions } = req.body;

    let comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(new CustomError('Comment not found', 404));
    }

    comment.replies.push({
      author: req.user.id,
      text,
      mentions: mentions || [],
    });

    await comment.save();

    comment = await comment.populate({
      path: 'replies.author',
      select: 'username email firstName lastName profileImage',
    });

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment,
  likeComment,
  replyToComment,
};
