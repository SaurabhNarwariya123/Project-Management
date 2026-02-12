const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const CustomError = require('../utils/errorHandler');

const allowedRoles = ['Admin', 'ProjectManager', 'TeamMember'];

const getUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password')
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!allowedRoles.includes(role)) {
      return next(new CustomError('Invalid role', 400));
    }

    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return next(new CustomError('User not found', 404));
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return next(new CustomError('isActive must be a boolean', 400));
    }

    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return next(new CustomError('User not found', 404));
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const { search, status, visibility, page = 1, limit = 10 } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    if (visibility) {
      query.visibility = visibility;
    }

    const projects = await Project.find(query)
      .populate('owner', 'username email firstName lastName')
      .populate('team.userId', 'username email firstName lastName profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      projects,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProjectByAdmin = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return next(new CustomError('Project not found', 404));
    }

    await Project.findByIdAndDelete(req.params.projectId);
    await Task.deleteMany({ project: req.params.projectId });
    await ActivityLog.deleteMany({ project: req.params.projectId });

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getActivityLogs = async (req, res, next) => {
  try {
    const { projectId, taskId, page = 1, limit = 20 } = req.query;

    const query = {};
    if (projectId) query.project = projectId;
    if (taskId) query.task = taskId;

    const logs = await ActivityLog.find(query)
      .populate('user', 'username email firstName lastName profileImage')
      .populate('task', 'title')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await ActivityLog.countDocuments(query);

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
  getUsers,
  updateUserRole,
  updateUserStatus,
  getProjects,
  deleteProjectByAdmin,
  getActivityLogs,
};
