const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: [
        'task_created',
        'task_updated',
        'task_assigned',
        'task_status_changed',
        'comment_added',
        'project_created',
        'project_updated',
        'member_added',
        'member_removed',
        'attachment_added',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    changes: {
      from: String,
      to: String,
    },
  },
  { timestamps: true }
);

// Index for faster queries
activityLogSchema.index({ project: 1, createdAt: -1 });
activityLogSchema.index({ task: 1 });
activityLogSchema.index({ user: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
