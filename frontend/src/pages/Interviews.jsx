import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobSeekerHeader from '../components/JobSeekerHeader';
import { interviewService } from '../services/apiService';
import { Calendar, Clock, MapPin, Briefcase, AlertCircle, Loader } from 'lucide-react';

export default function Interviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, scheduled, completed, cancelled

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await interviewService.getMyInterviews();
      setInterviews(response);
    } catch (err) {
      setError(err.message || 'Failed to load interviews');
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    if (filter === 'all') return true;
    return interview.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'No-Show': 'bg-orange-100 text-orange-800',
      'Rescheduled': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getInterviewTypeColor = (type) => {
    const colors = {
      'Online': 'bg-teal-100 text-teal-800',
      'Offline': 'bg-indigo-100 text-indigo-800',
      'Phone': 'bg-cyan-100 text-cyan-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <JobSeekerHeader />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Interviews</h1>
          <p className="text-gray-600">Manage and track your interview schedule</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['all', 'scheduled', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Interviews List */}
        {!loading && filteredInterviews.length > 0 && (
          <div className="space-y-4">
            {filteredInterviews.map(interview => (
              <div
                key={interview._id}
                onClick={() => navigate(`/interviews/${interview._id}`)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {interview.job?.title || 'Position'}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {interview.job?.company || 'Company'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(interview.status)}`}>
                    {interview.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{formatDate(interview.scheduledAt)}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{formatTime(interview.scheduledAt)}</span>
                  </div>

                  {/* Interview Type */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getInterviewTypeColor(interview.interviewType)}`}>
                      {interview.interviewType}
                    </span>
                  </div>
                </div>

                {/* Interview Location */}
                {interview.interviewType === 'Offline' && interview.location && (
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{interview.location}</span>
                  </div>
                )}

                {/* Interview URL */}
                {interview.interviewType === 'Online' && interview.meetingUrl && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Meeting URL: <a href={interview.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {interview.meetingUrl}
                      </a>
                    </p>
                  </div>
                )}

                {/* Confirmation Status */}
                {interview.status === 'Scheduled' && (
                  <div className="pt-4 border-t border-gray-200">
                    {interview.candidateConfirmed ? (
                      <p className="text-sm text-green-600 font-medium">✓ You confirmed this interview</p>
                    ) : (
                      <p className="text-sm text-orange-600 font-medium">Awaiting your confirmation</p>
                    )}
                  </div>
                )}

                {/* Feedback */}
                {interview.status === 'Completed' && interview.feedback && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Feedback:</p>
                    <p className="text-sm text-gray-600">{interview.feedback}</p>
                    {interview.rating && (
                      <p className="text-sm text-yellow-600 mt-2">Rating: {'⭐'.repeat(interview.rating)}</p>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredInterviews.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-lg">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No interviews scheduled</h3>
            <p className="text-gray-600 mb-4">When you apply to jobs and get shortlisted, interviews will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
