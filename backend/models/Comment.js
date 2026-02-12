const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please provide comment text'],
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    attachments: [
      {
        url: String,
        fileName: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        mentions: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
