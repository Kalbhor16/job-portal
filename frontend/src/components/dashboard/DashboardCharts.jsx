import React from 'react';

/**
 * DashboardCharts Component
 * Displays statistics charts for jobs and applicants
 * Ready to integrate with Recharts
 */
const DashboardCharts = ({ jobs = [], applicants = [] }) => {
  // Calculate applications per job
  const applicationsPerJob = jobs.map((job) => ({
    name: job.title.substring(0, 15),
    applications: job.applications,
  }));

  // Calculate applicant status distribution
  const statusDistribution = {
    'New': applicants.filter((a) => a.status === 'New').length,
    'Reviewed': applicants.filter((a) => a.status === 'Reviewed').length,
    'Shortlisted': applicants.filter((a) => a.status === 'Shortlisted').length,
    'Interview Scheduled': applicants.filter((a) => a.status === 'Interview Scheduled').length,
    'Rejected': applicants.filter((a) => a.status === 'Rejected').length,
    'Hired': applicants.filter((a) => a.status === 'Hired').length,
  };

  const statusColors = {
    'New': '#3b82f6',
    'Reviewed': '#a855f7',
    'Shortlisted': '#10b981',
    'Interview Scheduled': '#f59e0b',
    'Rejected': '#ef4444',
    'Hired': '#059669',
  };

  const maxApplications = Math.max(...applicationsPerJob.map((j) => j.applications), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Applications per Job - Bar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Applications per Job</h3>
        <div className="space-y-3">
          {applicationsPerJob.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No jobs posted yet</p>
          ) : (
            applicationsPerJob.map((job) => (
              <div key={job.name}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-gray-700">{job.name}</p>
                  <p className="text-sm font-bold text-emerald-600">{job.applications}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(job.applications / maxApplications) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Applicant Status Distribution - Pie Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Applicant Status Distribution</h3>
        <div className="space-y-3">
          {Object.entries(statusDistribution).map(([status, count]) => {
            const total = Object.values(statusDistribution).reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={status}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-gray-700">{status}</p>
                  <p className="text-sm font-bold text-gray-900">
                    {count} ({percentage}%)
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: statusColors[status],
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
