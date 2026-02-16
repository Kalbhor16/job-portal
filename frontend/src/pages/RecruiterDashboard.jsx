import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RecruiterLayout from '../layouts/RecruiterLayout';
import {
  Briefcase,
  Users,
  CheckCircle,
  AlertCircle,
  Eye,
  TrendingUp,
} from 'lucide-react';

// Dashboard sub-components
import StatsCard from '../components/dashboard/StatsCard';
import JobTable from '../components/dashboard/JobTable';
import ApplicantsTable from '../components/dashboard/ApplicantsTable';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import QuickActions from '../components/dashboard/QuickActions';

// Dashboard API service
import { dashboardAPI } from '../services/dashboardAPI';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);

  // Stats data
  const stats = {
    totalJobs: jobs.length,
    totalApplications: applicants.length,
    activeJobs: jobs.filter((j) => j.status === 'Active').length,
    newApplicants: applicants.filter((a) => a.status === 'New').length,
    hiredCount: applicants.filter((a) => a.status === 'Hired').length,
    profileViews: jobs.reduce((sum, job) => sum + job.views, 0),
    thisMonthApplications: applicants.length,
  };

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const jobsRes = await dashboardAPI.getJobs();
        const applicantsRes = await dashboardAPI.getApplicants();

        if (jobsRes.success) {
          setJobs(jobsRes.jobs);
        }

        if (applicantsRes.success) {
          setApplicants(applicantsRes.applicants);
        }

        setError('');
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle Applicant Status Update
  const handleApplicantStatusChange = async (applicantId, newStatus) => {
    try {
      const result = await dashboardAPI.updateApplicantStatus(applicantId, newStatus);
      if (result.success) {
        setApplicants((prev) =>
          prev.map((a) =>
            a._id === applicantId ? { ...a, status: newStatus } : a
          )
        );
      }
    } catch (err) {
      console.error('Failed to update applicant status:', err);
    }
  };

  // Handle Close Job
  const handleCloseJob = async (jobId) => {
    if (!confirm('Are you sure you want to close this job?')) return;
    try {
      const result = await dashboardAPI.closeJob(jobId);
      if (result.success) {
        setJobs((prev) =>
          prev.map((j) =>
            j._id === jobId ? { ...j, status: 'Closed' } : j
          )
        );
      }
    } catch (err) {
      console.error('Failed to close job:', err);
    }
  };

  if (loading) {
    return (
      <RecruiterLayout notificationCount={notificationCount}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout notificationCount={notificationCount}>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Welcome back, <span className="text-emerald-600">{user?.fullName || 'Recruiter'}</span>
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your recruitment process.
        </p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={Briefcase}
          label="Active Jobs"
          value={stats.activeJobs}
          trend={{ value: stats.activeJobs, label: `of ${stats.totalJobs} total` }}
          color="emerald"
        />

        <StatsCard
          icon={Users}
          label="Total Applications"
          value={stats.totalApplications}
          trend={{ value: stats.newApplicants, label: 'new today' }}
          color="blue"
        />

        <StatsCard
          icon={CheckCircle}
          label="Hired"
          value={stats.hiredCount}
          trend={{ value: 2, label: 'this month' }}
          color="green"
        />

        <StatsCard
          icon={Eye}
          label="Profile Views"
          value={stats.profileViews}
          trend={{ value: 12, label: 'this week' }}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
        <DashboardCharts jobs={jobs} applicants={applicants} />
      </div>

      {/* Recent Jobs and Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
            <button
              onClick={() => navigate('/my-jobs')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              View All →
            </button>
          </div>
          <JobTable
            jobs={jobs.slice(0, 3)}
            onCloseJob={handleCloseJob}
            onEditJob={(jobId) => navigate(`/post-job?edit=${jobId}`)}
            onViewApplicants={(jobId) => navigate(`/applicants/${jobId}`)}
          />
        </div>

        {/* Recent Applicants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Applicants</h2>
            <button
              onClick={() => navigate('/applicants')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              View All →
            </button>
          </div>
          <ApplicantsTable
            applicants={applicants.slice(0, 5)}
            onStatusChange={handleApplicantStatusChange}
          />
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterDashboard;
