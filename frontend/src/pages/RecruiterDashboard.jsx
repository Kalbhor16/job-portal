import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/jobs/my');
        const jobsList = res.data.jobs || [];
        setJobs(jobsList.slice(0, 5)); // Show first 5 jobs
        
        setStats({
          totalJobs: res.data.count,
          totalApplications: 0, // Can be enhanced later
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-emerald-700">Welcome, {user?.name || 'Recruiter'}</h1>
        <p className="text-sm text-gray-600">Manage your jobs, applications, and team.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Jobs Posted</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.totalJobs}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Applications</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Company</p>
          <p className="text-lg font-bold text-gray-800">{user?.companyName || 'N/A'}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate('/post-job')}
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition text-left"
        >
          <p className="font-semibold text-emerald-700">+ Post a Job</p>
          <p className="text-sm text-emerald-600">Create a new job listing</p>
        </button>

        <button
          onClick={() => navigate('/my-jobs')}
          className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-left"
        >
          <p className="font-semibold text-blue-700">Manage Jobs</p>
          <p className="text-sm text-blue-600">View and edit all your jobs</p>
        </button>

        <button
          onClick={() => navigate('/messages')}
          className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition text-left"
        >
          <p className="font-semibold text-purple-700">Messages</p>
          <p className="text-sm text-purple-600">Chat with applicants</p>
        </button>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Job Postings</h2>
          <button
            onClick={() => navigate('/my-jobs')}
            className="text-sm text-emerald-600 hover:text-emerald-700"
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center">Loading jobs...</div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 text-red-700">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="p-6 text-gray-600">No jobs posted yet. Create your first job posting!</div>
        ) : (
          <div className="divide-y">
            {jobs.map((job) => (
              <div key={job._id} className="p-4 flex justify-between items-start hover:bg-gray-50">
                <div className="flex-1">
                  <h3 className="font-semibold text-emerald-800">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/applicants/${job._id}`)}
                    className="px-3 py-1.5 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
                  >
                    Applicants
                  </button>
                  <button
                    onClick={() => navigate(`/post-job?edit=${job._id}`)}
                    className="px-3 py-1.5 text-xs border rounded hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
