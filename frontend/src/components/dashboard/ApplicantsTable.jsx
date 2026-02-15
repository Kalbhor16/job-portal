import React, { useState } from 'react';

/**
 * ApplicantsTable Component
 * Displays list of applicants with status management
 */
const ApplicantsTable = ({ 
  applicants = [], 
  loading = false,
  onStatusChange = null 
}) => {
  const [expandedApplicant, setExpandedApplicant] = useState(null);

  const statusOptions = [
    'New',
    'Reviewed',
    'Shortlisted',
    'Interview Scheduled',
    'Rejected',
    'Hired',
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      'New': 'bg-blue-100 text-blue-800',
      'Reviewed': 'bg-purple-100 text-purple-800',
      'Shortlisted': 'bg-green-100 text-green-800',
      'Interview Scheduled': 'bg-yellow-100 text-yellow-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Hired': 'bg-emerald-100 text-emerald-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-8">Loading applicants...</div>;
  }

  if (!applicants || applicants.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No applicants yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {applicants.map((applicant) => (
        <div
          key={applicant._id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
              <p className="text-sm text-gray-600">{applicant.jobTitle}</p>
              <p className="text-xs text-gray-500 mt-1">
                Applied: {new Date(applicant.appliedDate).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(applicant.status)}`}>
                {applicant.status}
              </span>

              <button
                onClick={() => setExpandedApplicant(expandedApplicant === applicant._id ? null : applicant._id)}
                className="text-gray-600 hover:text-emerald-600"
              >
                {expandedApplicant === applicant._id ? '▼' : '▶'}
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedApplicant === applicant._id && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-sm font-semibold">{applicant.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <p className="text-sm font-semibold">{applicant.status}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <select
                  defaultValue={applicant.status}
                  onChange={(e) => onStatusChange && onStatusChange(applicant._id, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      Change to: {status}
                    </option>
                  ))}
                </select>

                <button className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                  Schedule Interview
                </button>

                <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  View Resume
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicantsTable;
