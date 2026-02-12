const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    projectImage: {
      type: String,
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['Admin', 'Manager', 'Member'],
          default: 'Member',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    visibility: {
      type: String,
      enum: ['Public', 'Private'],
      default: 'Private',
    },
    status: {
      type: String,
      enum: ['Active', 'OnHold', 'Completed', 'Archived'],
      default: 'Active',
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    tags: [String],
  },
  { timestamps: true }
);

// Index for faster queries
projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ 'team.userId': 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
