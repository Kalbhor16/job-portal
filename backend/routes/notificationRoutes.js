const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
  getNotificationSettings,
  updateNotificationSettings,
} = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// Static routes (must come BEFORE dynamic :id routes)
router.get('/unread/count', getUnreadCount);
router.patch('/mark-all-read', markAllAsRead);
router.delete('/clear/all', deleteAllNotifications);

// Settings routes
router.get('/settings/preferences', getNotificationSettings);
router.patch('/settings/preferences', updateNotificationSettings);

// Dynamic ID routes (must come AFTER static routes)
router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
