import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';


const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/jobs');
        setJobs(res.data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleViewDetails = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-700">Welcome, {user?.fullName || 'Job Seeker'}</h1>
          <p className="text-sm text-gray-600">Explore latest job opportunities curated for you.</p>
          
        </div>
        
      </header>

      {loading ? (
        <div className="text-center py-20">Loading jobs...</div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {jobs.map((job) => (
            <div key={job._id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => handleViewDetails(job._id)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-emerald-800">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-700 line-clamp-3">{job.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">Salary: <span className="font-medium text-gray-800">${job.salary?.toLocaleString() || 'N/A'}</span></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(job._id);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSeekerDashboard;
