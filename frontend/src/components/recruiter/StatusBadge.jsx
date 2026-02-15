import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const statusColors = {
    'New': 'bg-blue-100 text-blue-800 border border-blue-300',
    'Reviewed': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    'Shortlisted': 'bg-purple-100 text-purple-800 border border-purple-300',
    'Interview Scheduled': 'bg-indigo-100 text-indigo-800 border border-indigo-300',
    'Rejected': 'bg-red-100 text-red-800 border border-red-300',
    'Hired': 'bg-primary-100 text-primary-800 border border-primary-300',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs font-medium rounded',
    md: 'px-3 py-1.5 text-sm font-medium rounded-full',
    lg: 'px-4 py-2 text-base font-medium rounded-lg',
  };

  return (
    <span className={`inline-block ${statusColors[status] || 'bg-gray-100 text-gray-800'} ${sizeClasses[size]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
