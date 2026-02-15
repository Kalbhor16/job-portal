const express = require('express');
const Notification = require('../models/Notification');
const NotificationSettings = require('../models/NotificationSettings');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/seed/notifications
// @desc    Create dummy notifications for testing
// @access  Private
router.post('/notifications', authMiddleware, async (req, res) => {
  try {
    // Clear existing notifications for this recruiter
    await Notification.deleteMany({ recruiterId: req.user.id });

    // Create dummy notifications of all types
    const dummyNotifications = [
      {
        recruiterId: req.user.id,
        type: 'application',
        title: 'New Application Received',
        message: 'John Doe has applied for Senior Frontend Developer position',
        relatedJobId: null,
        relatedCandidateId: null,
        isRead: false,
        actionUrl: '/applicants/123',
        icon: '📝',
      },
      {
        recruiterId: req.user.id,
        type: 'application',
        title: 'Application from Sarah Smith',
        message: 'Sarah Smith applied for Backend Developer position with 5 years experience',
        relatedJobId: null,
        relatedCandidateId: null,
        isRead: false,
        actionUrl: '/applicants/124',
        icon: '📝',
      },
      {
        recruiterId: req.user.id,
        type: 'interview',
        title: 'Interview Scheduled',
        message: 'Interview scheduled with Mike Johnson for Frontend Developer on Feb 20 at 2:00 PM',
        relatedJobId: null,
        relatedCandidateId: null,
        isRead: true,
        actionUrl: '/messages',
        icon: '📞',
      },
      {
        recruiterId: req.user.id,
        type: 'interview',
        title: 'Interview Reminder',
        message: 'Reminder: Interview with Emma Wilson in 1 hour - Full Stack Developer',
        relatedJobId: null,
        relatedCandidateId: null,
        isRead: false,
        actionUrl: '/messages',
        icon: '📞',
      },
      {
        recruiterId: req.user.id,
        type: 'job_update',
        title: 'Job Posting Expiring Soon',
        message: 'Your job posting "React Developer" will expire in 3 days. Renew to keep attracting candidates.',
        relatedJobId: null,
        relatedCandidateId: null,
        isRead: true,
        actionUrl: '/my-jobs',
        icon: '📢',
      },
      {
        recruiterId: req.user.id,
        type: 'job_update',
        title: 'Job Posted Successfully',
        message: 'Your job posting "Full Stack Developer" is now live and visible to all job seekers',
        relatedJobId: null,
        relatedCandidateId: null,
        isRead: true,
        actionUrl: '/my-jobs',
        icon: '📢',
      },
      {
        recruiterId: req.user.id,
        type: 'system',
        title: 'Account Update Available',
        message: 'New features available: Advanced analytics dashboard, candidate screening tools',
        relatedJobId: null,
        relatedCandidateId: null,
        isRead: true,
        actionUrl: '/recruiter',
        icon: '⚙️',
      },
      {
        recruiterId: req.user.id,
        type: 'system',
        title: 'Security Alert',
        message: 'New login from Chrome on Windows. If this was not you, secure your account now.',
        relatedJobId: null,
        relatedCandidateId: null,
        isRead: false,
        actionUrl: '/recruiter',
        icon: '⚙️',
      },
      {
        recruiterId: req.user.id,
        type: 'application',
        title: 'Applicant Withdrew Application',
        message: 'Robert Chen has withdrawn his application for DevOps Engineer position',
        relatedJobId: null,
        relatedCandidateId: null,
        isRead: true,
        actionUrl: '/my-jobs',
        icon: '📝',
      },
      {
        recruiterId: req.user.id,
        type: 'interview',
        title: 'Interview Feedback Submitted',
        message: 'Feedback for Lisa Anderson (Frontend Developer interview) has been submitted',
        relatedJobId: null,
        relatedCandidateId: null,
        isRead: false,
        actionUrl: '/applicants/125',
        icon: '📞',
      },
    ];

    const created = await Notification.insertMany(dummyNotifications);

    // Create or update notification settings
    await NotificationSettings.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        emailNotifications: true,
        pushNotifications: true,
        interviewReminders: true,
        applicationNotifications: true,
        jobUpdateNotifications: true,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: `Created ${created.length} dummy notifications`,
      notificationsCount: created.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed notifications',
      error: error.message,
    });
  }
});

module.exports = router;
