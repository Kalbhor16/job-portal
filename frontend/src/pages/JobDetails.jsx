import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MapPin, Briefcase, DollarSign, Calendar, Code, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${jobId}`);
        setJob(res.data.job);

        if (user?.role === 'jobseeker') {
          try {
            const appRes = await api.get(`/applications/my`);
            const applied = appRes.data.applications.some((app) => app.job._id === jobId);
            setHasApplied(applied);
          } catch (err) {
            // Ignore error
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, user]);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!resumeUrl.trim()) {
      alert('Please enter your resume URL');
      return;
    }

    try {
      setApplying(true);
      await api.post(`/applications/${jobId}`, {
        resumeUrl,
        coverLetter,
      });

      alert('Application submitted successfully!');
      setResumeUrl('');
      setCoverLetter('');
      setHasApplied(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
            <AlertCircle size={24} className="flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold mb-1">Failed to Load Job</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-gray-600 text-lg">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all mb-6 font-medium"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6 text-white">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
                <p className="text-lg text-green-100">{job.company || 'Company'}</p>
              </div>
              <span className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full font-bold text-sm">
                {job.status}
              </span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-green-100">
            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Location</p>
                <p className="text-sm font-semibold text-gray-900">{job.location}</p>
              </div>
            </div>

            {/* Job Type */}
            <div className="flex items-start gap-3">
              <Briefcase size={20} className="text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Job Type</p>
                <p className="text-sm font-semibold text-gray-900">{job.jobType || 'Full-Time'}</p>
              </div>
            </div>

            {/* Experience Level */}
            <div className="flex items-start gap-3">
              <Code size={20} className="text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Experience</p>
                <p className="text-sm font-semibold text-gray-900">{job.experienceLevel || 'Mid'}</p>
              </div>
            </div>

            {/* Posted Date */}
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs text-gray-600 font-medium">Posted</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Salary Section */}
            {(job.salaryMin || job.salaryMax) && (
              <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign size={22} className="text-green-600" />
                  <h2 className="text-lg font-bold text-gray-900">Salary Range</h2>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-600">
                    {job.currency} {job.salaryMin?.toLocaleString() || 'N/A'}
                  </span>
                  <span className="text-gray-600 mx-2">to</span>
                  <span className="text-3xl font-bold text-emerald-600">
                    {job.currency} {job.salaryMax?.toLocaleString() || 'N/A'}
                  </span>
                  <span className="text-gray-600 ml-2">per year</span>
                </div>
              </div>
            )}

            {/* Deadline Section */}
            {job.applicationDeadline && (
              <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={22} className="text-green-600" />
                  <h2 className="text-lg font-bold text-gray-900">Application Deadline</h2>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(job.applicationDeadline).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}

            {/* Required Skills */}
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code size={22} className="text-green-600" />
                  <h2 className="text-lg font-bold text-gray-900">Required Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full font-semibold text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
              </div>
            </div>

            {/* Required Links */}
            {job.requiredLinks && Object.values(job.requiredLinks).some(v => v.required || v.optional) && (
              <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Required Documents</h2>
                <div className="space-y-3">
                  {job.requiredLinks.portfolio?.required && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="font-medium text-gray-900">Portfolio - <span className="text-red-600">Required</span></span>
                    </div>
                  )}
                  {job.requiredLinks.linkedin?.required && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="font-medium text-gray-900">LinkedIn Profile - <span className="text-red-600">Required</span></span>
                    </div>
                  )}
                  {job.requiredLinks.github?.required && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="font-medium text-gray-900">GitHub Profile - <span className="text-red-600">Required</span></span>
                    </div>
                  )}
                  {job.requiredLinks.majorProject?.required && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="font-medium text-gray-900">Major Project - <span className="text-red-600">Required</span></span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Custom Questions */}
            {job.customQuestions && job.customQuestions.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Screening Questions</h2>
                <div className="space-y-4">
                  {job.customQuestions.map((question, idx) => (
                    <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="font-semibold text-gray-900 mb-2">
                        Q{idx + 1}. {question.questionText} 
                        {question.required && <span className="text-red-600 ml-1">*</span>}
                      </p>
                      <p className="text-sm text-gray-600">Type: {question.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Application Section for Job Seekers */}
            {user?.role === 'jobseeker' && (
              <div className="bg-white rounded-xl shadow-md border border-green-100 p-6 sticky top-8">
                {!hasApplied ? (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Apply Now</h3>
                    <form onSubmit={handleApply} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Resume URL *</label>
                        <input
                          type="url"
                          value={resumeUrl}
                          onChange={(e) => setResumeUrl(e.target.value)}
                          placeholder="https://example.com/resume.pdf"
                          className="w-full px-4 py-3 border-2 border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Cover Letter (optional)</label>
                        <textarea
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Tell the recruiter about yourself..."
                          rows="5"
                          className="w-full px-4 py-3 border-2 border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-600 transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={applying}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg"
                      >
                        {applying ? 'Submitting...' : '✅ Submit Application'}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={24} className="text-green-600" />
                      <p className="font-bold text-green-800">Already Applied</p>
                    </div>
                    <p className="text-sm text-green-700">You have already submitted an application for this job. Good luck!</p>
                  </div>
                )}
              </div>
            )}

            {/* Recruiter Actions */}
            {user?.role === 'recruiter' && (
              <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recruiter Actions</h3>
                <button
                  onClick={() => navigate(`/applicants/${jobId}`)}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all font-bold shadow-lg"
                >
                  👥 View Applicants
                </button>
              </div>
            )}

            {/* Job Info Card */}
            <div className="bg-green-50 rounded-xl border border-green-200 p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-3">Job Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Posted by</p>
                  <p className="font-semibold text-gray-900">{job.company || 'Company'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Job ID</p>
                  <p className="font-mono text-xs text-gray-700 break-all">{job._id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
