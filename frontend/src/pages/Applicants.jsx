import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import RecruiterLayout from '../layouts/RecruiterLayout';

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/applications/job/${jobId}`);
        setApplications(res.data.applications || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? res.data.application : app))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleMessage = (applicantId) => {
    navigate(`/messages?user=${applicantId}&job=${jobId}`);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <RecruiterLayout>
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/recruiter')}
          className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-emerald-700">Applicants</h1>
      </div>

      {loading ? (
        <div className="text-center py-20">Loading applicants...</div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>
      ) : applications.length === 0 ? (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded">No applications yet.</div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/recruiter/applicants/${app._id}`)}>
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-emerald-600 transition-colors">
                    {app.applicant.name}
                  </h3>
                  <p className="text-sm text-gray-600">{app.applicant.email}</p>
                  {app.coverLetter && (
                    <div className="mt-2 p-2 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700"><strong>Cover Letter:</strong> {app.coverLetter}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>

                  <button
                    onClick={() => navigate(`/recruiter/applicants/${app._id}`)}
                    className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  >
                    View Details
                  </button>

                  {app.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(app._id, 'accepted')}
                        className="px-3 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app._id, 'rejected')}
                        className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleMessage(app.applicant._id)}
                    className="px-3 py-1.5 text-xs border rounded hover:bg-emerald-50 text-emerald-700"
                  >
                    Message
                  </button>

                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  >
                    View Resume
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </RecruiterLayout>
  );
};

export default Applicants;
