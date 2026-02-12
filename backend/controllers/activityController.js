const ActivityLog = require('../models/ActivityLog');
const CustomError = require('../utils/errorHandler');

// Get activity logs by project
const getActivityLogsByProject = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const logs = await ActivityLog.find({ project: req.params.projectId })
      .populate('user', 'username email firstName lastName profileImage')
      .populate('task', 'title')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await ActivityLog.countDocuments({ project: req.params.projectId });

    res.status(200).json({
      success: true,
      logs,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// Get activity logs by task
const getActivityLogsByTask = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const logs = await ActivityLog.find({ task: req.params.taskId })
      .populate('user', 'username email firstName lastName profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await ActivityLog.countDocuments({ task: req.params.taskId });

    res.status(200).json({
      success: true,
      logs,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityLogsByProject,
  getActivityLogsByTask,
};
