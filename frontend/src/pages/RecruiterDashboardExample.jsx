import React, { useState, useEffect } from 'react';
import RecruiterLayout from '../layouts/RecruiterLayout';
import { useAuth } from '../context/AuthContext';

/**
 * Example Recruiter Dashboard
 * Shows how to use RecruiterHeader with RecruiterLayout
 */
const RecruiterDashboardExample = () => {
  const { user } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingInterviews: 0,
    newMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with your actual API calls
        // const response = await fetch('/api/recruiter/dashboard');
        // const data = await response.json();
        // setStats(data.stats);
        // setNotificationCount(data.notificationCount);

        // Mock data for demo
        setStats({
          activeJobs: 8,
          totalApplications: 45,
          pendingInterviews: 5,
          newMessages: 3,
        });
        setNotificationCount(3);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full"></div>
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout notificationCount={notificationCount}>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.companyName} • Manage your recruitment process
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Active Jobs Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Jobs</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.activeJobs}
              </p>
            </div>
            <span className="text-3xl">💼</span>
          </div>
          <a
            href="/recruiter/jobs"
            className="text-green-600 hover:text-green-700 font-semibold text-sm mt-4 inline-block"
          >
            View All →
          </a>
        </div>

        {/* Total Applications Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Applications</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.totalApplications}
              </p>
            </div>
            <span className="text-3xl">📋</span>
          </div>
          <a
            href="/recruiter/applicants"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm mt-4 inline-block"
          >
            Review →
          </a>
        </div>

        {/* Pending Interviews Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Interviews</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats.pendingInterviews}
              </p>
            </div>
            <span className="text-3xl">🎤</span>
          </div>
          <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm mt-4">
            Schedule →
          </button>
        </div>

        {/* Messages Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">New Messages</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats.newMessages}
              </p>
            </div>
            <span className="text-3xl">💬</span>
          </div>
          <a
            href="/recruiter/messages"
            className="text-orange-600 hover:text-orange-700 font-semibold text-sm mt-4 inline-block"
          >
            Check →
          </a>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/recruiter/post-job"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 border border-green-200 transition-colors"
            >
              <span className="text-2xl">✍️</span>
              <div>
                <p className="font-semibold text-gray-900">Post New Job</p>
                <p className="text-sm text-gray-600">Create a job opening</p>
              </div>
            </a>

            <a
              href="/recruiter/applicants"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 border border-blue-200 transition-colors"
            >
              <span className="text-2xl">👥</span>
              <div>
                <p className="font-semibold text-gray-900">Review Applicants</p>
                <p className="text-sm text-gray-600">View applications</p>
              </div>
            </a>

            <a
              href="/recruiter/company-profile"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 border border-purple-200 transition-colors"
            >
              <span className="text-2xl">🏢</span>
              <div>
                <p className="font-semibold text-gray-900">Company Profile</p>
                <p className="text-sm text-gray-600">Update information</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Job Postings</h2>
          <div className="space-y-3">
            {[
              { id: 1, title: 'Senior React Developer', applications: 12, posted: '2 days ago' },
              { id: 2, title: 'Product Manager', applications: 8, posted: '5 days ago' },
              { id: 3, title: 'UI/UX Designer', applications: 15, posted: '1 week ago' },
            ].map((job) => (
              <div key={job.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{job.applications} applications • Posted {job.posted}</p>
                  </div>
                  <button className="text-green-600 hover:text-green-700 font-semibold text-sm px-3 py-1 rounded hover:bg-green-50">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 p-6 bg-green-50 border-l-4 border-green-600 rounded-lg">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <span>💡</span> Pro Tips
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          <li>• Respond to applications quickly to attract top talent</li>
          <li>• Update your company profile to stand out to candidates</li>
          <li>• Use specific keywords in job descriptions for better matches</li>
        </ul>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterDashboardExample;
