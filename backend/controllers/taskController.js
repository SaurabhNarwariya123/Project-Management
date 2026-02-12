const Task = require('../models/Task');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');
const CustomError = require('../utils/errorHandler');

// Create task
const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      estimatedHours,
      sprint,
      tags,
    } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return next(new CustomError('Project not found', 404));
    }

    let task = await Task.create({
      title,
      description,
      project: req.params.projectId,
      createdBy: req.user.id,
      priority: priority || 'Medium',
      dueDate,
      estimatedHours,
      sprint,
      tags: tags || [],
    });

    task = await task.populate('createdBy', 'username email firstName lastName profileImage');

    project.tasks.push(task._id);
    await project.save();

    // Create activity log
    await ActivityLog.create({
      project: req.params.projectId,
      task: task._id,
      user: req.user.id,
      action: 'task_created',
      description: `${req.user.username} created task "${title}"`,
    });

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Get tasks by project
const getTasksByProject = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      assignedTo,
      search,
      sortBy = 'createdAt',
      page = 1,
      limit = 10,
    } = req.query;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return next(new CustomError('Project not found', 404));
    }

    let query = { project: req.params.projectId };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'username email firstName lastName profileImage')
      .populate('createdBy', 'username email firstName lastName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ [sortBy]: -1 });

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      tasks,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// Get task by ID
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('assignedTo', 'username email firstName lastName profileImage')
      .populate('createdBy', 'username email firstName lastName')
      .populate({
        path: 'comments',
        populate: {
          path: 'author mentions',
          select: 'username email firstName lastName profileImage',
        },
      })
      .populate('watchers', 'username email firstName lastName profileImage');

    if (!task) {
      return next(new CustomError('Task not found', 404));
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Update task
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.taskId);

    if (!task) {
      return next(new CustomError('Task not found', 404));
    }

    const {
      title,
      description,
      priority,
      status,
      dueDate,
      estimatedHours,
      actualHours,
      assignedTo,
      sprint,
      tags,
    } = req.body;

    const oldStatus = task.status;
    const oldAssignee = task.assignedTo;

    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (estimatedHours) task.estimatedHours = estimatedHours;
    if (actualHours) task.actualHours = actualHours;
    if (assignedTo) task.assignedTo = assignedTo;
    if (sprint) task.sprint = sprint;
    if (tags) task.tags = tags;

    await task.save();

    task = await task.populate('assignedTo', 'username email firstName lastName profileImage');

    // Create activity logs for changes
    if (status && oldStatus !== status) {
      await ActivityLog.create({
        project: task.project,
        task: task._id,
        user: req.user.id,
        action: 'task_status_changed',
        description: `${req.user.username} changed task status from "${oldStatus}" to "${status}"`,
        changes: {
          from: oldStatus,
          to: status,
        },
      });
    }

    if (assignedTo && oldAssignee !== assignedTo) {
      await ActivityLog.create({
        project: task.project,
        task: task._id,
        user: req.user.id,
        action: 'task_assigned',
        description: `${req.user.username} assigned task to ${assignedTo}`,
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Delete task
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return next(new CustomError('Task not found', 404));
    }

    const project = await Project.findById(task.project);
    project.tasks = project.tasks.filter((t) => t.toString() !== req.params.taskId);
    await project.save();

    await Task.findByIdAndDelete(req.params.taskId);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Assign task to user
const assignTask = async (req, res, next) => {
  try {
    const { userId } = req.body;

    let task = await Task.findById(req.params.taskId);

    if (!task) {
      return next(new CustomError('Task not found', 404));
    }

    task.assignedTo = userId;
    await task.save();

    task = await task.populate('assignedTo', 'username email firstName lastName profileImage');

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Add watcher to task
const addWatcher = async (req, res, next) => {
  try {
    const { userId } = req.body;

    let task = await Task.findById(req.params.taskId);

    if (!task) {
      return next(new CustomError('Task not found', 404));
    }

    if (!task.watchers.includes(userId)) {
      task.watchers.push(userId);
      await task.save();
    }

    task = await task.populate('watchers', 'username email firstName lastName profileImage');

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Remove watcher from task
const removeWatcher = async (req, res, next) => {
  try {
    const { userId } = req.body;

    let task = await Task.findById(req.params.taskId);

    if (!task) {
      return next(new CustomError('Task not found', 404));
    }

    task.watchers = task.watchers.filter((w) => w.toString() !== userId);
    await task.save();

    task = await task.populate('watchers', 'username email firstName lastName profileImage');

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  addWatcher,
  removeWatcher,
};
