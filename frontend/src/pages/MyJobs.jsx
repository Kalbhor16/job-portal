import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    applications: 0,
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/jobs/my');
        setJobs(res.data.jobs || []);
        setStats({
          total: res.data.count,
          applications: 0, // Can be calculated if needed
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">My Jobs</h1>
          <p className="text-sm text-gray-600">Manage your job postings</p>
        </div>
        <button
          onClick={() => navigate('/post-job')}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          + Post a Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Jobs Posted</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.total}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading jobs...</div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">No job postings yet. Click "Post a Job" to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-emerald-800">{job.title}</h3>
                <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                <p className="mt-2 text-sm text-gray-700 line-clamp-2">{job.description}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Posted on {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="ml-4 flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/job-details/${job._id}`)}
                  className="px-3 py-1.5 text-sm border rounded hover:bg-emerald-50 text-emerald-700"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/applicants/${job._id}`)}
                  className="px-3 py-1.5 text-sm bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
                >
                  Applicants
                </button>
                <button
                  onClick={() => navigate(`/post-job?edit=${job._id}`)}
                  className="px-3 py-1.5 text-sm border rounded hover:bg-blue-50 text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
