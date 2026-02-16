import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import {
  Briefcase,
  Heart,
  MessageSquare,
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
  MapPin,
  Search,
  Filter,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  BookmarkCheck,
} from 'lucide-react';

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State Management
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [salaryRange, setSalaryRange] = useState([0, 500000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('jobs');

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [jobsRes, applicationsRes, savedJobsRes, messagesRes, notificationsRes] = 
        await Promise.all([
          api.get('/jobs').catch(() => ({ data: { jobs: [] } })),
          api.get('/applications/my').catch(() => ({ data: { applications: [] } })),
          api.get('/saved-jobs').catch(() => ({ data: { savedJobs: [] } })),
          api.get('/messages/conversations/all/list').catch(() => ({ data: { conversations: [] } })),
          api.get('/notifications/unread/count').catch(() => ({ data: { count: 0 } })),
        ]);

      setJobs(jobsRes.data.jobs || []);
      setApplications(applicationsRes.data.applications || []);
      setSavedJobs(savedJobsRes.data.savedJobs || []);
      setMessages(messagesRes.data.conversations || []);
      setNotifications(notificationsRes.data.count || 0);

      applyFilters(jobsRes.data.jobs || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply Filters
  const applyFilters = (jobsList = jobs) => {
    let filtered = jobsList;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Job type filter
    if (selectedJobType !== 'all') {
      filtered = filtered.filter(job => job.jobType === selectedJobType);
    }

    // Salary range filter
    filtered = filtered.filter(job => 
      job.salary >= salaryRange[0] && job.salary <= salaryRange[1]
    );

    // Sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'salary-high') {
      filtered.sort((a, b) => b.salary - a.salary);
    } else if (sortBy === 'salary-low') {
      filtered.sort((a, b) => a.salary - b.salary);
    }

    setFilteredJobs(filtered);
  };

  // Update filters
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedJobType, salaryRange, sortBy, jobs]);

  // Save/Unsave Job
  const handleSaveJob = async (jobId, e) => {
    e.stopPropagation();
    try {
      const isAlreadySaved = savedJobs.some(sj => sj.jobId?._id === jobId);
      
      if (isAlreadySaved) {
        await api.delete(`/saved-jobs/${jobId}`);
        setSavedJobs(savedJobs.filter(sj => sj.jobId?._id !== jobId));
        setSuccess('Job removed from saved');
      } else {
        await api.post(`/saved-jobs/${jobId}`);
        setSavedJobs([...savedJobs, { jobId: { _id: jobId } }]);
        setSuccess('Job saved successfully');
      }
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Error saving job:', err);
      setError('Failed to save job');
    }
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(sj => sj.jobId?._id === jobId);
  };

  // Get application status for a job
  const getApplicationStatus = (jobId) => {
    const app = applications.find(a => a.job?._id === jobId);
    return app?.status;
  };

  // Stats Data
  const stats = [
    {
      label: 'Jobs Applied',
      value: applications.length,
      icon: Briefcase,
      color: 'bg-blue-50 text-blue-600',
      trend: `${applications.filter(a => a.status === 'New').length} pending`,
    },
    {
      label: 'Saved Jobs',
      value: savedJobs.length,
      icon: BookmarkCheck,
      color: 'bg-purple-50 text-purple-600',
      trend: 'For later review',
    },
    {
      label: 'Messages',
      value: messages.length,
      icon: MessageSquare,
      color: 'bg-green-50 text-green-600',
      trend: notifications > 0 ? `${notifications} new` : 'All read',
    },
    {
      label: 'Applications',
      value: {
        pending: applications.filter(a => ['New', 'Reviewed'].includes(a.status)).length,
        shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      },
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600',
      trend: 'In progress',
    },
  ];

  const handleViewDetails = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  const QuickActionsSection = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <button
        onClick={() => setActiveTab('jobs')}
        className={`p-4 rounded-lg transition flex items-center gap-2 ${
          activeTab === 'jobs'
            ? 'bg-emerald-600 text-white'
            : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-600'
        }`}
      >
        <Briefcase size={18} />
        <span className="text-sm font-medium">Browse Jobs</span>
      </button>
      <button
        onClick={() => navigate('/applications')}
        className="p-4 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-emerald-600 transition flex items-center gap-2"
      >
        <FileText size={18} />
        <span className="text-sm font-medium">Applications</span>
      </button>
      <button
        onClick={() => navigate('/saved-jobs')}
        className="p-4 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-emerald-600 transition flex items-center gap-2"
      >
        <BookmarkCheck size={18} />
        <span className="text-sm font-medium">Saved Jobs</span>
      </button>
      <button
        onClick={() => navigate('/messages')}
        className="p-4 rounded-lg bg-white border border-gray-200 text-gray-700 hover:border-emerald-600 transition flex items-center gap-2 relative"
      >
        <MessageSquare size={18} />
        <span className="text-sm font-medium">Messages</span>
        {notifications > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications}
          </span>
        )}
      </button>
    </div>
  );

  const StatsSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className={`${stat.color} rounded-lg p-6 border border-gray-100`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold mt-2">
                {typeof stat.value === 'object' 
                  ? `${stat.value.pending + stat.value.shortlisted}` 
                  : stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-2">{stat.trend}</p>
            </div>
            <stat.icon size={32} className="opacity-20" />
          </div>
        </div>
      ))}
    </div>
  );

  const JobFilterSection = () => (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
            showFilters
              ? 'bg-emerald-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:border-emerald-600'
          }`}
        >
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
              </select>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range: ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="500000"
                step="10000"
                value={salaryRange[1]}
                onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedJobType('all');
              setSalaryRange([0, 500000]);
              setSortBy('newest');
            }}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );

  const JobsGridSection = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
        <p className="text-sm text-gray-600">{filteredJobs.length} jobs found</p>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">No jobs found matching your criteria</p>
          <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const status = getApplicationStatus(job._id);
            const isSaved = isJobSaved(job._id);

            return (
              <div
                key={job._id}
                className="bg-white rounded-lg p-5 border border-gray-200 hover:shadow-lg hover:border-emerald-300 transition cursor-pointer"
                onClick={() => handleViewDetails(job._id)}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                  <button
                    onClick={(e) => handleSaveJob(job._id, e)}
                    className={`p-2 rounded-lg transition ${
                      isSaved
                        ? 'bg-red-50 text-red-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Location & Job Type */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} />
                    ${job.salary?.toLocaleString() || 'N/A'}/year
                  </div>
                  {job.jobType && (
                    <div className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded font-medium">
                      {job.jobType}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                  {job.description}
                </p>

                {/* Status Badge */}
                {status && (
                  <div className="mb-3 flex items-center gap-2">
                    {status === 'Hired' && (
                      <div className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        <CheckCircle size={14} />
                        Hired
                      </div>
                    )}
                    {status === 'Rejected' && (
                      <div className="flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                        <AlertCircle size={14} />
                        Rejected
                      </div>
                    )}
                    {['New', 'Reviewed', 'Shortlisted', 'Interview Scheduled'].includes(status) && (
                      <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        <Clock size={14} />
                        {status}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(job._id);
                  }}
                  className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition flex items-center justify-center gap-2"
                >
                  View Details
                  <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const RecentApplicationsSection = () => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
        <button
          onClick={() => navigate('/applications')}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
        >
          View All <ChevronRight size={16} />
        </button>
      </div>

      {applications.length === 0 ? (
        <p className="text-gray-600 text-sm">No applications yet. Browse jobs to get started!</p>
      ) : (
        <div className="space-y-3">
          {applications.slice(0, 5).map((app) => (
            <div
              key={app._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              onClick={() => navigate(`/applications/${app._id}`)}
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{app.job?.title}</p>
                <p className="text-sm text-gray-600">{app.job?.company}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                app.status === 'Hired' ? 'bg-green-100 text-green-800' :
                app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                app.status === 'Shortlisted' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const RecentSavedJobsSection = () => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Saved Jobs</h3>
        <button
          onClick={() => navigate('/saved-jobs')}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
        >
          View All <ChevronRight size={16} />
        </button>
      </div>

      {savedJobs.length === 0 ? (
        <p className="text-gray-600 text-sm">No saved jobs yet. Save jobs to review later!</p>
      ) : (
        <div className="space-y-3">
          {savedJobs.slice(0, 5).map((saved) => (
            <div
              key={saved._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              onClick={() => handleViewDetails(saved.jobId?._id)}
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{saved.jobId?.title}</p>
                <p className="text-sm text-gray-600">{saved.jobId?.company}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveJob(saved.jobId?._id, e);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Heart size={16} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Welcome back, <span className="text-emerald-600">{user?.fullName || 'Job Seeker'}</span>
            </h1>
            <p className="text-gray-600 mt-2">Explore opportunities, manage your applications, and advance your career.</p>
          </header>

          {/* Error & Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
              <CheckCircle size={20} />
              {success}
            </div>
          )}

          {/* Quick Actions */}
          <QuickActionsSection />

          {/* Stats */}
          <StatsSection />

          {/* Main Content */}
          {activeTab === 'jobs' ? (
            <div className="space-y-6">
              <JobFilterSection />
              <JobsGridSection />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentApplicationsSection />
              <RecentSavedJobsSection />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobSeekerDashboard;
