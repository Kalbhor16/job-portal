import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RecruiterLayout from '../layouts/RecruiterLayout';

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
    <RecruiterLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Jobs</h1>
              <p className="text-gray-600 mt-2">Manage your job postings</p>
            </div>
            <button
              onClick={() => navigate('/post-job')}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              + Post a Job
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-6">
              <p className="text-sm text-gray-600 font-medium">Total Jobs Posted</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-green-200 p-6">
              <p className="text-sm text-gray-600 font-medium">Status</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {jobs.filter((j) => j.status === 'Active').length} Active
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
                <p className="text-gray-600 mt-4">Loading jobs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl">
              {error}
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
              <p className="text-yellow-800 font-medium">
                No job postings yet. Click "Post a Job" to create one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition-all hover:border-green-300"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 border-b border-green-100">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {job.company || 'Your Company'} • {job.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            job.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    {/* Description */}
                    <div>
                      <p className="text-sm text-gray-700 line-clamp-3">{job.description}</p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Job Type */}
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 font-medium">Job Type</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {job.jobType || 'Full-Time'}
                        </p>
                      </div>

                      {/* Experience Level */}
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 font-medium">Experience</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          {job.experienceLevel || 'Mid'}
                        </p>
                      </div>

                      {/* Salary */}
                      {(job.salaryMin || job.salaryMax) && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 font-medium">Salary Range</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {job.salaryMin && `${job.currency} ${job.salaryMin}`}
                            {job.salaryMin && job.salaryMax && ' - '}
                            {job.salaryMax && `${job.currency} ${job.salaryMax}`}
                          </p>
                        </div>
                      )}

                      {/* Deadline */}
                      {job.applicationDeadline && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 font-medium">Deadline</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {new Date(job.applicationDeadline).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-2">Required Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.requiredSkills.length > 4 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                              +{job.requiredSkills.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Posted Date */}
                    <p className="text-xs text-gray-500">
                      Posted on {new Date(job.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Card Footer - Actions */}
                  <div className="px-5 py-4 bg-gray-50 border-t border-green-100 flex gap-2">
                    <button
                      onClick={() => navigate(`/job-details/${job._id}`)}
                      className="flex-1 px-3 py-2 text-sm border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/applicants/${job._id}`)}
                      className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Applicants
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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
    </RecruiterLayout>
  );
};

export default MyJobs;
