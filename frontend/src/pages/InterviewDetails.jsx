import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobSeekerHeader from '../components/JobSeekerHeader';
import { interviewService } from '../services/apiService';
import { Calendar, Clock, MapPin, Briefcase, AlertCircle, Loader, ArrowLeft, CheckCircle } from 'lucide-react';

export default function InterviewDetails() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [proposedDate, setProposedDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchInterviewDetails();
  }, [interviewId]);

  const fetchInterviewDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await interviewService.getInterviewDetails(interviewId);
      setInterview(response);
    } catch (err) {
      setError(err.message || 'Failed to load interview details');
      console.error('Error fetching interview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmInterview = async () => {
    try {
      setConfirming(true);
      await interviewService.confirmInterview(interviewId);
      await fetchInterviewDetails();
    } catch (err) {
      setError(err.message || 'Failed to confirm interview');
    } finally {
      setConfirming(false);
    }
  };

  const handleRequestReschedule = async (e) => {
    e.preventDefault();
    if (!proposedDate || !reason.trim()) {
      setError('Please provide a proposed date and reason');
      return;
    }
    try {
      setRescheduling(true);
      await interviewService.requestReschedule(interviewId, {
        proposedDate,
        reason
      });
      await fetchInterviewDetails();
      setProposedDate('');
      setReason('');
    } catch (err) {
      setError(err.message || 'Failed to request reschedule');
    } finally {
      setRescheduling(false);
    }
  };

  const handleCancelInterview = async () => {
    if (!window.confirm('Are you sure you want to cancel this interview?')) return;
    try {
      setCancelling(true);
      await interviewService.cancelInterview(interviewId, {
        reason: 'Cancelled by candidate'
      });
      navigate('/interviews', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to cancel interview');
    } finally {
      setCancelling(false);
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <JobSeekerHeader />
        <div className="flex justify-center items-center py-32">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error && !interview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <JobSeekerHeader />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-900">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <JobSeekerHeader />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800">Interview not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JobSeekerHeader />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/interviews')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Interviews
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{interview.job?.title}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {interview.job?.company}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(interview.status)}`}>
              {interview.status}
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interview Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Interview Details</h2>

              <div className="space-y-4">
                {/* Date and Time */}
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-1">Scheduled Date & Time</p>
                  <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    {formatDateTime(interview.scheduledAt)}
                  </div>
                </div>

                {/* Interview Type */}
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-2">Interview Type</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {interview.interviewType}
                  </span>
                </div>

                {/* Location/URL */}
                {interview.interviewType === 'Online' && interview.meetingUrl && (
                  <div className="border-b pb-4">
                    <p className="text-sm text-gray-600 mb-2">Meeting Link</p>
                    <a
                      href={interview.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium break-all"
                    >
                      {interview.meetingUrl}
                    </a>
                  </div>
                )}

                {interview.interviewType === 'Offline' && interview.location && (
                  <div className="border-b pb-4">
                    <p className="text-sm text-gray-600 mb-2">Location</p>
                    <div className="flex items-center gap-2 text-gray-900">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      {interview.location}
                    </div>
                  </div>
                )}

                {interview.interviewType === 'Phone' && interview.phoneNumber && (
                  <div className="border-b pb-4">
                    <p className="text-sm text-gray-600 mb-2">Phone Number</p>
                    <a href={`tel:${interview.phoneNumber}`} className="text-blue-600 hover:text-blue-700 font-medium">
                      {interview.phoneNumber}
                    </a>
                  </div>
                )}

                {/* Confirmation Status */}
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600 mb-2">Your Confirmation Status</p>
                  {interview.candidateConfirmed ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Interview Confirmed
                    </div>
                  ) : (
                    <div className="text-orange-600 font-medium">Awaiting Your Confirmation</div>
                  )}
                </div>

                {/* Feedback (if completed) */}
                {interview.status === 'Completed' && (
                  <>
                    {interview.feedback && (
                      <div className="border-b pb-4">
                        <p className="text-sm text-gray-600 mb-2">Feedback</p>
                        <p className="text-gray-900">{interview.feedback}</p>
                      </div>
                    )}
                    {interview.rating && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Rating</p>
                        <div className="flex">
                          {Array.from({ length: interview.rating }).map((_, i) => (
                            <span key={i} className="text-2xl">⭐</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Reschedule Request Info */}
                {interview.rescheduleRequested && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <p className="text-sm font-medium text-yellow-900 mb-1">Reschedule Requested</p>
                    <p className="text-sm text-yellow-800">Proposed: {formatDateTime(interview.proposedRescheduleDate)}</p>
                    {interview.rescheduleReason && (
                      <p className="text-sm text-yellow-800 mt-1">Reason: {interview.rescheduleReason}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Job Details Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Position Details</h2>
              <p className="text-gray-700 mb-4">{interview.job?.description}</p>
              <div className="flex gap-2 flex-wrap">
                {interview.job?.requiredSkills?.slice(0, 5).map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-4">
            {/* Confirmation Button */}
            {interview.status === 'Scheduled' && !interview.candidateConfirmed && (
              <button
                onClick={handleConfirmInterview}
                disabled={confirming}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition"
              >
                {confirming ? 'Confirming...' : 'Confirm Interview'}
              </button>
            )}

            {/* Reschedule Form */}
            {interview.status === 'Scheduled' && !interview.rescheduling && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4">Request Reschedule</h3>
                <form onSubmit={handleRequestReschedule}>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Date</label>
                    <input
                      type="datetime-local"
                      value={proposedDate}
                      onChange={(e) => setProposedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Why do you need to reschedule?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={rescheduling}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {rescheduling ? 'Requesting...' : 'Request Reschedule'}
                  </button>
                </form>
              </div>
            )}

            {/* Cancel Button */}
            {interview.status === 'Scheduled' && (
              <button
                onClick={handleCancelInterview}
                disabled={cancelling}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Interview'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
