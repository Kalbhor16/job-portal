import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const RecruiterHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef(null);

  // Navigation items for recruiter (matching actual routes)
  const navigationItems = [
    { label: 'Dashboard', href: '/recruiter' },
    { label: 'Post Job', href: '/post-job' },
    { label: 'My Jobs', href: '/my-jobs' },
    { label: 'Messages', href: '/messages' },
  ];

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread/count');
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    // Fetch unread count on component mount
    fetchUnreadCount();

    // Set up interval to poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileDropdownOpen]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Check if link is active
  const isActive = (href) => {
    return location.pathname === href ||
      location.pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link
            to="/recruiter"
            className="flex items-center gap-3 group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <span className="text-base font-bold text-white">JH</span>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:inline group-hover:text-green-600 transition-colors duration-300">
              JobHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Notification Bell */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300"
              aria-label="Notifications"
              title="View Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown (Desktop) */}
            <div className="hidden sm:block relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 group ${
                  isProfileDropdownOpen
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform duration-300">
                  {user?.fullName?.charAt(0).toUpperCase() || 'R'}
                </div>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className="font-semibold text-gray-900">{user?.fullName || 'Recruiter'}</span>
                  <span className="text-xs text-gray-500">{user?.email?.split('@')[0] || 'User'}</span>
                </div>
                <svg className={`w-4 h-4 text-gray-700 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-2xl bg-white border border-gray-200 py-1 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.fullName || 'Recruiter'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {user?.email}
                    </p>
                    {user?.companyName && (
                      <p className="text-xs text-green-600 font-semibold mt-2">
                        {user?.companyName}
                      </p>
                    )}
                  </div>

                  <Link
                    to="/recruiter"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 font-medium"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <Link
                    to="/recruiter/profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 font-medium"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      My Profile
                    </div>
                  </Link>

                  <Link
                    to="/recruiter/company-profile"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 font-medium"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                      </svg>
                      Company Profile
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-200 border-t border-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden border-t border-gray-100 py-3 space-y-1 animate-in slide-in-from-top-2 duration-300">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`block px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-green-700 bg-green-50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Profile Section */}
            <div className="px-4 py-3 border-t border-gray-100 mt-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                  {user?.fullName?.charAt(0).toUpperCase() || 'R'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">
                    {user?.fullName || 'Recruiter'}
                  </p>
                  <p className="text-xs text-gray-600">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                </div>
              </div>

              <Link
                to="/recruiter"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/recruiter/profile"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 font-medium mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  My Profile
                </div>
              </Link>

              <Link
                to="/recruiter/company-profile"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  </svg>
                  Company Profile
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium mt-2"
              >
                Sign Out
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default RecruiterHeader;
