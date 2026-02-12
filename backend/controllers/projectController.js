const Project = require('../models/Project');
const User = require('../models/User');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const CustomError = require('../utils/errorHandler');

// Create project
const createProject = async (req, res, next) => {
  try {
    const { name, description, visibility, startDate, endDate, tags } = req.body;

    let project = await Project.create({
      name,
      description,
      owner: req.user.id,
      visibility: visibility || 'Private',
      startDate,
      endDate,
      tags: tags || [],
      team: [
        {
          userId: req.user.id,
          role: 'Admin',
        },
      ],
    });

    project = await project.populate('owner', 'username email firstName lastName profileImage');

    // Create activity log
    await ActivityLog.create({
      project: project._id,
      user: req.user.id,
      action: 'project_created',
      description: `${req.user.username} created project "${name}"`,
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Get all projects
const getProjects = async (req, res, next) => {
  try {
    const { search, status, visibility, page = 1, limit = 10 } = req.query;

    let query = {
      $or: [
        { owner: req.user.id },
        { 'team.userId': req.user.id },
      ],
    };

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

// Get project by ID
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'username email firstName lastName profileImage')
      .populate('team.userId', 'username email firstName lastName profileImage role')
      .populate('tasks');

    if (!project) {
      return next(new CustomError('Project not found', 404));
    }

    // Check if user is part of project or project is public
    const isMember = project.team.some((member) => member.userId._id.toString() === req.user.id);
    const isOwner = project.owner._id.toString() === req.user.id;

    if (!isMember && !isOwner && project.visibility === 'Private') {
      return next(new CustomError('Not authorized to access this project', 403));
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Update project
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return next(new CustomError('Project not found', 404));
    }

    // Check authorization
    if (project.owner.toString() !== req.user.id) {
      return next(new CustomError('Not authorized to update this project', 403));
    }

    const { name, description, visibility, status, startDate, endDate, tags } = req.body;

    if (name) project.name = name;
    if (description) project.description = description;
    if (visibility) project.visibility = visibility;
    if (status) project.status = status;
    if (startDate) project.startDate = startDate;
    if (endDate) project.endDate = endDate;
    if (tags) project.tags = tags;

    await project.save();

    project = await project.populate('owner', 'username email firstName lastName');

    // Create activity log
    await ActivityLog.create({
      project: project._id,
      user: req.user.id,
      action: 'project_updated',
      description: `${req.user.username} updated project "${project.name}"`,
    });

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Delete project
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new CustomError('Project not found', 404));
    }

    // Check authorization
    if (project.owner.toString() !== req.user.id) {
      return next(new CustomError('Not authorized to delete this project', 403));
    }

    await Project.findByIdAndDelete(req.params.id);

    // Delete related tasks and activity logs
    await Task.deleteMany({ project: req.params.id });
    await ActivityLog.deleteMany({ project: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Add team member to project
const addTeamMember = async (req, res, next) => {
  try {
    const { userId, role } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return next(new CustomError('Project not found', 404));
    }

    // Check authorization
    if (project.owner.toString() !== req.user.id) {
      return next(new CustomError('Not authorized to add members to this project', 403));
    }

    // Check if user is already a member
    const isMember = project.team.some((member) => member.userId.toString() === userId);

    if (isMember) {
      return next(new CustomError('User is already a member of this project', 400));
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new CustomError('User not found', 404));
    }

    project.team.push({
      userId,
      role: role || 'Member',
    });

    await project.save();

    project = await project.populate('team.userId', 'username email firstName lastName profileImage');

    // Create activity log
    await ActivityLog.create({
      project: project._id,
      user: req.user.id,
      action: 'member_added',
      description: `${req.user.username} added ${user.username} to the project`,
    });

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Remove team member from project
const removeTeamMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return next(new CustomError('Project not found', 404));
    }

    // Check authorization
    if (project.owner.toString() !== req.user.id) {
      return next(new CustomError('Not authorized to remove members from this project', 403));
    }

    project.team = project.team.filter((member) => member.userId.toString() !== userId);

    await project.save();

    project = await project.populate('team.userId', 'username email firstName lastName profileImage');

    // Create activity log
    const user = await User.findById(userId);
    await ActivityLog.create({
      project: project._id,
      user: req.user.id,
      action: 'member_removed',
      description: `${req.user.username} removed ${user.username} from the project`,
    });

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
};
