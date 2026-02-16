import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, Download, Loader } from 'lucide-react';
import api from '../services/api';

const Applications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');

  useEffect(() => {
    if (success) {
      setTimeout(() => setSuccess(''), 3000);
    }
  }, [success]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications/my');
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      New: 'bg-blue-100 text-blue-900',
      Reviewed: 'bg-yellow-100 text-yellow-900',
      Shortlisted: 'bg-purple-100 text-purple-900',
      'Interview Scheduled': 'bg-green-100 text-green-900',
      Rejected: 'bg-red-100 text-red-900',
      Hired: 'bg-emerald-100 text-emerald-900',
    };
    return colors[status] || 'bg-gray-100 text-gray-900';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-4">No applications yet</p>
            <button
              onClick={() => navigate('/jobs')}
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* Job Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {app.job?.title || 'Job Title'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {app.job?.company || 'Company Name'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500 mb-2">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold w-fit ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* Interview Info */}
                  <div className="flex flex-col">
                    {app.status === 'Interview Scheduled' ? (
                      <>
                        <p className="text-xs text-gray-500 mb-2">Interview Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(app.interviewScheduledAt).toLocaleDateString()}
                        </p>
                      </>
                    ) : app.status === 'Rejected' ? (
                      <>
                        <p className="text-xs text-gray-500 mb-2">Rejection Reason</p>
                        <p className="text-sm text-gray-700">{app.rejectionReason || 'N/A'}</p>
                      </>
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => navigate(`/applications/${app._id}`)}
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm"
                      >
                        <Download size={16} />
                        Resume
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;

