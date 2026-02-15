const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
    interviewReminders: {
      type: Boolean,
      default: true,
    },
    applicationNotifications: {
      type: Boolean,
      default: true,
    },
    jobUpdateNotifications: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NotificationSettings', notificationSettingsSchema);
