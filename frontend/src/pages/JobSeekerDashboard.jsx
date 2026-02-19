import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  BookmarkPlus, 
  MessageSquare, 
  Calendar, 
  FileText,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { applicationService, interviewService, savedJobService } from '../services/apiService';
import JobSeekerHeader from '../components/JobSeekerHeader';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: 0,
    shortlistedApplications: 0,
    interviewsScheduled: 0,
    savedJobs: 0,
  });
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch applications
      const appRes = await applicationService.getMyApplications();
      const apps = appRes.data.applications || [];
      setApplications(apps.slice(0, 5)); // Show last 5
      
      // Calculate stats
      const shortlisted = apps.filter(app => app.status === 'Shortlisted').length;
      const interviewed = apps.filter(app => app.status === 'Interview Scheduled').length;
      
      // Fetch interviews
      const intRes = await interviewService.getMyInterviews();
      const interviews = intRes.data.interviews || [];
      setInterviews(interviews.slice(0, 3)); // Show next 3 interviews
      
      // Calculate notification count
      const newInterviews = interviews.filter(int => !int.candidateConfirmed).length;
      setNotificationCount(newInterviews);
      
      setStats({
        totalApplications: apps.length,
        shortlistedApplications: shortlisted,
        interviewsScheduled: interviews.length,
        savedJobs: apps.length, // Placeholder
      });
      
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'New': 'bg-blue-100 text-blue-800',
      'Reviewed': 'bg-yellow-100 text-yellow-800',
      'Shortlisted': 'bg-green-100 text-green-800',
      'Interview Scheduled': 'bg-purple-100 text-purple-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Hired': 'bg-green-100 text-green-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <JobSeekerHeader notificationCount={notificationCount} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <JobSeekerHeader notificationCount={notificationCount} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="md-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome to Your,<span className='text-emerald-600'> Job Seeker</span> </h1>
          <p className="text-gray-600 mt-1">Track your applications, interviews, and job search progress in one place</p>
        </div>
        <br /><br />
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Applications */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Applications</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.totalApplications}</p>
              </div>
              <Briefcase className="text-emerald-600 opacity-20" size={40} />
            </div>
          </div>

          {/* Shortlisted */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Shortlisted</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.shortlistedApplications}</p>
              </div>
              <CheckCircle className="text-green-600 opacity-20" size={40} />
            </div>
          </div>

          {/* Interviews Scheduled */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Interviews Scheduled</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.interviewsScheduled}</p>
              </div>
              <Calendar className="text-purple-600 opacity-20" size={40} />
            </div>
          </div>

          {/* Saved Jobs */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Saved Jobs</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.savedJobs}</p>
              </div>
              <BookmarkPlus className="text-blue-600 opacity-20" size={40} />
            </div>
          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              <button
                onClick={() => navigate('/applications')}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1"
              >
                View All <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="divide-y">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app._id} className="p-4 hover:bg-gray-50 transition cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.job?.title || 'Job Title'}</h3>
                        <p className="text-sm text-gray-600">{app.job?.company || 'Company'}</p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Applied on {formatDate(app.appliedAt)}</span>
                      <button
                        onClick={() => navigate(`/applications/${app._id}`)}
                        className="text-emerald-600 hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Briefcase size={40} className="mx-auto mb-3 opacity-20" />
                  <p>No applications yet. Start applying to jobs!</p>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition "
                  >
                    Browse Jobs
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Interviews</h2>
            </div>
            
            <div className="divide-y">
              {interviews.length > 0 ? (
                interviews.map((interview) => (
                  <div key={interview._id} className="p-4 hover:bg-gray-50 transition">
                    <div className="mb-3">
                      <p className="font-semibold text-gray-900 text-sm">{interview.job?.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{interview.job?.company}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                      <Calendar size={14} />
                      {formatDate(interview.scheduledAt)}
                    </div>
                    <div className="text-xs font-medium">
                      <span className={`inline-block px-2 py-1 rounded ${
                        interview.interviewType === 'Online' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {interview.interviewType} Interview
                      </span>
                    </div>
                    {!interview.candidateConfirmed && (
                      <button
                        onClick={() => navigate(`/interviews/${interview._id}`)}
                        className="mt-2 w-full bg-emerald-50 text-emerald-600 text-xs font-medium py-1 rounded hover:bg-emerald-100 transition"
                      >
                        Confirm Interview
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Calendar size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No interviews scheduled yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/jobs')}
            className="bg-white border-2 border-emerald-200 hover:border-emerald-600 rounded-lg p-4 text-center transition group"
          >
            <Briefcase className="mx-auto mb-2 text-emerald-600 group-hover:scale-110 transition" size={32} />
            <p className="font-semibold text-gray-900">Browse Jobs</p>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="bg-white border-2 border-blue-200 hover:border-blue-600 rounded-lg p-4 text-center transition group"
          >
            <FileText className="mx-auto mb-2 text-blue-600 group-hover:scale-110 transition" size={32} />
            <p className="font-semibold text-gray-900">Edit Profile</p>
          </button>

          <button
            onClick={() => navigate('/saved-jobs')}
            className="bg-white border-2 border-purple-200 hover:border-purple-600 rounded-lg p-4 text-center transition group"
          >
            <BookmarkPlus className="mx-auto mb-2 text-purple-600 group-hover:scale-110 transition" size={32} />
            <p className="font-semibold text-gray-900">Saved Jobs</p>
          </button>

          <button
            onClick={() => navigate('/messages')}
            className="bg-white border-2 border-orange-200 hover:border-orange-600 rounded-lg p-4 text-center transition group"
          >
            <MessageSquare className="mx-auto mb-2 text-orange-600 group-hover:scale-110 transition" size={32} />
            <p className="font-semibold text-gray-900">Messages</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;
