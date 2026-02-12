const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Todo', 'InProgress', 'InReview', 'Done'],
      default: 'Todo',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    estimatedHours: {
      type: Number,
      default: null,
    },
    actualHours: {
      type: Number,
      default: null,
    },
    sprint: {
      type: String,
      default: null,
    },
    tags: [String],
    attachments: [
      {
        url: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    subtasks: [
      {
        title: String,
        completed: {
          type: Boolean,
          default: false,
        },
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    watchers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
