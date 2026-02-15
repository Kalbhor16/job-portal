import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * JobTable Component
 * Displays list of jobs with actions
 */
const JobTable = ({ 
  jobs = [], 
  loading = false, 
  onEditJob = null,
  onViewApplicants = null,
  onCloseJob = null 
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Active': 'bg-green-100 text-green-800',
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Closed': 'bg-gray-100 text-gray-800',
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  const getDeadlineColor = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'text-red-600';
    if (days < 7) return 'text-orange-600';
    return 'text-green-600';
  };

  if (loading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">No jobs found</p>
        <button
          onClick={() => navigate('/post-job')}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          Post a Job
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Job Title</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Applications</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Views</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Deadline</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div>
                  <p className="font-semibold text-gray-900">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.location}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(job.status)}`}>
                  {job.status}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <p className="text-lg font-bold text-emerald-600">{job.applications}</p>
              </td>
              <td className="px-4 py-3 text-center">
                <p className="text-lg font-bold text-blue-600">{job.views}</p>
              </td>
              <td className="px-4 py-3">
                <p className={`text-sm font-medium ${getDeadlineColor(job.deadline)}`}>
                  {new Date(job.deadline).toLocaleDateString()}
                </p>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => onEditJob ? onEditJob(job._id) : navigate(`/post-job?edit=${job._id}`)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onViewApplicants ? onViewApplicants(job._id) : navigate(`/applicants/${job._id}`)}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    Applicants
                  </button>
                  {job.status !== 'Closed' && (
                    <button
                      onClick={() => onCloseJob && onCloseJob(job._id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Close
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
