import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobSeekerHeader from '../components/JobSeekerHeader';
import { jobService, applicationService } from '../services/apiService';
import { Upload, ArrowLeft, Loader, AlertCircle } from 'lucide-react';

export default function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState('');
  
  const [formData, setFormData] = useState({
    coverLetter: '',
    answers: {},
  });

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(jobId);
      setJob(response);
    } catch (err) {
      setError(err.message || 'Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setResumeName(file.name);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionIndex]: answer,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!resume) {
      setError('Please upload your resume');
      return;
    }

    try {
      setSubmitting(true);
      
      const form = new FormData();
      form.append('resume', resume);
      form.append('coverLetter', formData.coverLetter);

      if (job?.customQuestions && job.customQuestions.length > 0) {
        const answers = job.customQuestions.map((q, idx) => ({
          question: q.question,
          answer: formData.answers[idx] || '',
        }));
        form.append('answers', JSON.stringify(answers));
      }

      await applicationService.applyJob(jobId, form);
      navigate('/applications', {
        state: { message: 'Application submitted successfully!' },
      });
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
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

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <JobSeekerHeader />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/jobs')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </button>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800">Job not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JobSeekerHeader />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(`/job-details/${jobId}`)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Details
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Job Summary */}
          <div className="mb-8 pb-8 border-b">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-gray-600 mb-4">{job.company}</p>
            <p className="text-gray-700 line-clamp-3">{job.description}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Resume <span className="text-red-600">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition cursor-pointer bg-gray-50">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="hidden"
                  id="resume-input"
                  required
                />
                <label htmlFor="resume-input" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">
                    {resumeName || 'Click to upload resume'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 10MB)</p>
                </label>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Cover Letter
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                placeholder="Tell the recruiter why you're interested in this role..."
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Optional - A cover letter can boost your chances</p>
            </div>

            {/* Custom Questions */}
            {job.customQuestions && job.customQuestions.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Application Questions</h3>
                <div className="space-y-6">
                  {job.customQuestions.map((question, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        {question.question}
                        {question.required && <span className="text-red-600"> *</span>}
                      </label>

                      {question.type === 'text' && (
                        <input
                          type="text"
                          value={formData.answers[idx] || ''}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          placeholder="Your answer"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={question.required}
                        />
                      )}

                      {question.type === 'textarea' && (
                        <textarea
                          value={formData.answers[idx] || ''}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          placeholder="Your answer"
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={question.required}
                        />
                      )}

                      {question.type === 'yes/no' && (
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${idx}`}
                              value="Yes"
                              onChange={(e) => handleAnswerChange(idx, e.target.value)}
                              checked={formData.answers[idx] === 'Yes'}
                              required={question.required}
                            />
                            <span className="text-gray-700">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${idx}`}
                              value="No"
                              onChange={(e) => handleAnswerChange(idx, e.target.value)}
                              checked={formData.answers[idx] === 'No'}
                              required={question.required}
                            />
                            <span className="text-gray-700">No</span>
                          </label>
                        </div>
                      )}

                      {question.type === 'multiple-choice' && (
                        <select
                          value={formData.answers[idx] || ''}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required={question.required}
                        >
                          <option value="">Select an option</option>
                          {question.options?.map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/job-details/${jobId}`)}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

