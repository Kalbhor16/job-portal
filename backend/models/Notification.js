const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['application', 'interview', 'job_update', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    relatedCandidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    actionUrl: {
      type: String,
    },
    icon: {
      type: String,
      default: 'info',
    },
  },
  { timestamps: true }
);

// Index for faster queries
notificationSchema.index({ recruiterId: 1, createdAt: -1 });
notificationSchema.index({ recruiterId: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
