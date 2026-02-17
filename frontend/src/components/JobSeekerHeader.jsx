import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

const JobSeekerHeader = ({ notificationCount = 0 }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/job-seeker-dashboard' },
    { id: 'applications', label: 'Applications', path: '/applications' },
    { id: 'saved-jobs', label: 'Saved Jobs', path: '/saved-jobs' },
    { id: 'messages', label: 'Messages', path: '/messages' },
  ];

  const isActive = (path) => {
    if (path === '/job-seeker-dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          {/* Left Section - Logo */}
          <button
            onClick={() => navigate('/job-seeker-dashboard')}
            className="flex items-center gap-2 py-4 px-2 font-bold text-lg bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent hover:from-emerald-700 hover:to-green-700 transition-all flex-shrink-0 whitespace-nowrap"
          >
            <span className="text-emerald-600 text-xl">💼</span>
            JobHub
          </button>

          {/* Middle Section - Navigation Cards */}
          <div className="flex items-center gap-2 flex-1 justify-center px-4">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const showBadge = item.id === 'messages' && notificationCount > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`relative px-4 py-2 rounded-lg transition font-semibold ${
                    active
                      ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-700'
                      : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {item.label}
                  {showBadge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Section - Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className={`relative p-2 rounded-lg transition ${
                notificationCount > 0
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Bell size={24} />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                
                {notificationCount > 0 ? (
                  <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700">
                        You have <span className="font-semibold text-blue-600">{notificationCount}</span> new message{notificationCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/messages');
                        setShowNotificationDropdown(false);
                      }}
                      className="w-full text-center py-2 px-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded font-medium transition"
                    >
                      View Messages
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-600">
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default JobSeekerHeader;
