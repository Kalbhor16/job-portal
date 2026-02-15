const Notification = require('../models/Notification');
const NotificationSettings = require('../models/NotificationSettings');

// @route   GET /api/notifications
// @desc    Get user notifications with pagination and filters
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, isRead } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { recruiterId: req.user.id };

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    // Get total count
    const total = await Notification.countDocuments(filter);

    // Get notifications
    const notifications = await Notification.find(filter)
      .populate('relatedJobId', 'title')
      .populate('relatedCandidateId', 'name email')
      .populate('relatedApplicationId', 'status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      recruiterId: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

// @route   PATCH /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Verify ownership
    if (notification.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification',
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
      error: error.message,
    });
  }
};

// @route   PATCH /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { recruiterId: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications',
      error: error.message,
    });
  }
};

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Verify ownership
    if (notification.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification',
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message,
    });
  }
};

// @route   DELETE /api/notifications/clear/all
// @desc    Delete all notifications
// @access  Private
exports.deleteAllNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({ recruiterId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'All notifications deleted',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete notifications',
      error: error.message,
    });
  }
};

// @route   GET /api/notifications/unread/count
// @desc    Get unread notifications count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recruiterId: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count',
      error: error.message,
    });
  }
};

// @route   GET /api/notification-settings
// @desc    Get notification settings
// @access  Private
exports.getNotificationSettings = async (req, res) => {
  try {
    let settings = await NotificationSettings.findOne({ userId: req.user.id });

    // Create default settings if not found
    if (!settings) {
      settings = await NotificationSettings.create({ userId: req.user.id });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message,
    });
  }
};

// @route   PATCH /api/notification-settings
// @desc    Update notification settings
// @access  Private
exports.updateNotificationSettings = async (req, res) => {
  try {
    const {
      emailNotifications,
      pushNotifications,
      interviewReminders,
      applicationNotifications,
      jobUpdateNotifications,
    } = req.body;

    let settings = await NotificationSettings.findOne({ userId: req.user.id });

    if (!settings) {
      settings = await NotificationSettings.create({ userId: req.user.id });
    }

    if (emailNotifications !== undefined) settings.emailNotifications = emailNotifications;
    if (pushNotifications !== undefined) settings.pushNotifications = pushNotifications;
    if (interviewReminders !== undefined) settings.interviewReminders = interviewReminders;
    if (applicationNotifications !== undefined)
      settings.applicationNotifications = applicationNotifications;
    if (jobUpdateNotifications !== undefined)
      settings.jobUpdateNotifications = jobUpdateNotifications;

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message,
    });
  }
};

// Helper function to create notification
exports.createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};
