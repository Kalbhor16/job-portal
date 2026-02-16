import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

const Dashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  useEffect(() => {
    if (user?.role === 'recruiter') {
      fetchMyJobs();
    }
  }, [user]);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/jobs/my');

      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (err) {
      setError('Failed to load your jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) {
      try {
        setDeleteError('');
        setDeleteSuccess('');
        const response = await api.delete(`/jobs/${jobId}`);

        if (response.data.success) {
          setJobs(jobs.filter((job) => job._id !== jobId));
          setDeleteSuccess('✅ Job deleted successfully!');
          setTimeout(() => setDeleteSuccess(''), 3000);
        }
      } catch (err) {
        setDeleteError('❌ Failed to delete job');
        setTimeout(() => setDeleteError(''), 3000);
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="recruiter">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="recruiter">
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              👋 Welcome, {user?.fullName}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your job postings and reach top talent
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link
              to="/post-job"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
            >
              ➕ Post New Job
            </Link>
            <Link
              to="/"
              className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg shadow transition"
            >
              👀 View All Jobs
            </Link>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Job Listings */}
          <h3 className="text-xl font-semibold mb-6">
            📋 Your Job Postings
          </h3>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          {deleteSuccess && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
              {deleteSuccess}
            </div>
          )}
          {deleteError && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {deleteError}
            </div>
          )}

          {jobs.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <p className="text-lg">📭 You haven't posted any jobs yet</p>
              <p className="text-gray-500 mt-4">
                Start by creating your first job posting to attract talented candidates!
              </p>
              <Link
                to="/post-job"
                className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow transition"
              >
                ✨ Create Your First Job
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-6">
                You have <strong>{jobs.length}</strong> active job posting{jobs.length !== 1 ? 's' : ''}
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {job.title}
                    </h3>

                    <p className="text-gray-600 mb-1">🏢 {job.company}</p>
                    <p className="text-gray-600 mb-1">📍 {job.location}</p>
                    <p className="text-gray-600 mb-3">
                      💰 ${job.salary.toLocaleString()}/year
                    </p>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                      {job.description}
                    </p>

                    <p className="text-sm text-gray-400 mb-4">
                      Posted on{' '}
                      <strong>
                        {new Date(job.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </strong>
                    </p>

                    <button
                      onClick={() => handleDeleteJob(job._id, job.title)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
