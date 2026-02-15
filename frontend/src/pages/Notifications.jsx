import React, { useState, useEffect } from 'react';
import { Bell, Trash2, CheckCheck, Settings, Loader, X } from 'lucide-react';
import RecruiterLayout from '../layouts/RecruiterLayout';
import api from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    interviewReminders: true,
    applicationNotifications: true,
    jobUpdateNotifications: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [selectedFilter, showUnreadOnly, currentPage]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      let query = `/notifications?page=${currentPage}&limit=10`;

      if (selectedFilter !== 'all') {
        query += `&type=${selectedFilter}`;
      }

      if (showUnreadOnly) {
        query += `&isRead=false`;
      }

      const res = await api.get(query);
      setNotifications(res.data.notifications);
      setTotalPages(res.data.pagination.total);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread/count');
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get('/notifications/settings/preferences');
      setSettings(res.data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;

    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(
        notifications.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(id);
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) return;

    try {
      await api.delete('/notifications/clear/all');
      setNotifications([]);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
  };

  const handleSettingChange = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSavingSettings(true);
      await api.patch('/notifications/settings/preferences', settings);
      alert('✅ Settings saved successfully!');
      setShowSettings(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const groupByDate = (notifications) => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    const groups = { today: [], yesterday: [], earlier: [] };

    notifications.forEach((notif) => {
      const notifDate = new Date(notif.createdAt).toDateString();

      if (notifDate === today) {
        groups.today.push(notif);
      } else if (notifDate === yesterday) {
        groups.yesterday.push(notif);
      } else {
        groups.earlier.push(notif);
      }
    });

    return groups;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      application: '📝',
      interview: '📞',
      job_update: '📢',
      system: '⚙️',
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type) => {
    const colors = {
      application: 'border-blue-200 bg-blue-50',
      interview: 'border-purple-200 bg-purple-50',
      job_update: 'border-green-200 bg-green-50',
      system: 'border-gray-200 bg-gray-50',
    };
    return colors[type] || 'border-gray-200 bg-gray-50';
  };

  const groupedNotifications = groupByDate(notifications);

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Bell size={32} className="text-green-600" />
                  <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
                  {unreadCount > 0 && (
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-gray-600">Stay updated with all job portal activities</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    try {
                      await api.post('/seed/notifications');
                      alert('✅ Dummy notifications created! Refreshing...');
                      setTimeout(() => window.location.reload(), 500);
                    } catch (error) {
                      alert('Error creating dummy data: ' + error.message);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                  title="Load demo notifications"
                >
                  📊 Load Demo Data
                </button>
                <button
                  onClick={() => {
                    setShowSettings(!showSettings);
                    if (!showSettings) fetchSettings();
                  }}
                  className="p-3 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-all hover:scale-105"
                  title="Notification settings"
                >
                  <Settings size={24} className="text-green-600" />
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Filter Dropdown */}
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-green-300 rounded-lg bg-white hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
              >
                <option value="all">All Types</option>
                <option value="application">Applications</option>
                <option value="interview">Interviews</option>
                <option value="job_update">Job Updates</option>
                <option value="system">System Alerts</option>
              </select>

              {/* Unread Filter */}
              <label className="flex items-center gap-2 px-4 py-2 border border-green-300 rounded-lg bg-white hover:border-green-400 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => {
                    setShowUnreadOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="w-4 h-4 text-green-600 accent-green-600 rounded"
                />
                <span className="font-medium text-gray-700">Unread Only</span>
              </label>

              {/* Mark All as Read */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                >
                  <CheckCheck size={18} />
                  Mark All Read
                </button>
              )}

              {/* Delete All */}
              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
                >
                  <Trash2 size={18} />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1 hover:bg-green-100 rounded-lg transition-all"
                  >
                    <X size={24} className="text-gray-600" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {/* Email Notifications */}
                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={() => handleSettingChange('emailNotifications')}
                      className="w-5 h-5 text-green-600 accent-green-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                  </label>

                  {/* Push Notifications */}
                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={() => handleSettingChange('pushNotifications')}
                      className="w-5 h-5 text-green-600 accent-green-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">Get browser notifications</p>
                    </div>
                  </label>

                  {/* Application Notifications */}
                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={settings.applicationNotifications}
                      onChange={() => handleSettingChange('applicationNotifications')}
                      className="w-5 h-5 text-green-600 accent-green-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Application Alerts</p>
                      <p className="text-sm text-gray-600">New applications received</p>
                    </div>
                  </label>

                  {/* Interview Reminders */}
                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={settings.interviewReminders}
                      onChange={() => handleSettingChange('interviewReminders')}
                      className="w-5 h-5 text-green-600 accent-green-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Interview Reminders</p>
                      <p className="text-sm text-gray-600">Upcoming interview alerts</p>
                    </div>
                  </label>

                  {/* Job Update Notifications */}
                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      checked={settings.jobUpdateNotifications}
                      onChange={() => handleSettingChange('jobUpdateNotifications')}
                      className="w-5 h-5 text-green-600 accent-green-600 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Job Updates</p>
                      <p className="text-sm text-gray-600">Posted job status changes</p>
                    </div>
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all font-medium flex items-center justify-center gap-2"
                  >
                    {savingSettings ? <Loader size={18} className="animate-spin" /> : null}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          {loading ? (
            <div className="text-center py-20">
              <Loader size={40} className="text-green-600 mx-auto animate-spin mb-4" />
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-green-100 p-12 text-center">
              <Bell size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">No notifications yet</p>
              <p className="text-gray-500 mb-6">When you get new activity, it will show up here</p>
              <button
                onClick={async () => {
                  try {
                    await api.post('/seed/notifications');
                    alert('✅ Dummy notifications created! Refreshing...');
                    setTimeout(() => window.location.reload(), 500);
                  } catch (error) {
                    alert('Error creating dummy data: ' + error.message);
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                📊 Try Loading Demo Data
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Today */}
              {groupedNotifications.today.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold text-gray-600 uppercase mb-4 pl-2">Today</h2>
                  <div className="space-y-3">
                    {groupedNotifications.today.map((notif) => (
                      <NotificationCard
                        key={notif._id}
                        notification={notif}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDelete}
                        isDeleting={deleting === notif._id}
                        getIcon={getNotificationIcon}
                        getColor={getNotificationColor}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Yesterday */}
              {groupedNotifications.yesterday.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold text-gray-600 uppercase mb-4 pl-2">Yesterday</h2>
                  <div className="space-y-3">
                    {groupedNotifications.yesterday.map((notif) => (
                      <NotificationCard
                        key={notif._id}
                        notification={notif}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDelete}
                        isDeleting={deleting === notif._id}
                        getIcon={getNotificationIcon}
                        getColor={getNotificationColor}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Earlier */}
              {groupedNotifications.earlier.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold text-gray-600 uppercase mb-4 pl-2">Earlier</h2>
                  <div className="space-y-3">
                    {groupedNotifications.earlier.map((notif) => (
                      <NotificationCard
                        key={notif._id}
                        notification={notif}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDelete}
                        isDeleting={deleting === notif._id}
                        getIcon={getNotificationIcon}
                        getColor={getNotificationColor}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2 flex-wrap">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-green-300 rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => 
                totalPages <= 5 ? i + 1 : Math.max(1, currentPage - 2) + i
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-green-600 text-white'
                      : 'border border-green-300 text-green-600 hover:bg-green-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-green-300 rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
};

// Notification Card Component
const NotificationCard = ({
  notification,
  onMarkAsRead,
  onDelete,
  isDeleting,
  getIcon,
  getColor,
}) => {
  return (
    <div
      className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md ${getColor(
        notification.type
      )} ${!notification.isRead ? 'border-l-green-600' : 'border-l-gray-300'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <span className="text-2xl mt-1">{getIcon(notification.type)}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900">{notification.title}</h3>
              {!notification.isRead && (
                <span className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></span>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!notification.isRead && (
            <button
              onClick={() => onMarkAsRead(notification._id, notification.isRead)}
              title="Mark as read"
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
            >
              <CheckCheck size={18} />
            </button>
          )}
          <button
            onClick={() => onDelete(notification._id)}
            disabled={isDeleting}
            title="Delete"
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
