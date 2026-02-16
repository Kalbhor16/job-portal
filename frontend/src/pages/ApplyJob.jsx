import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, ArrowLeft, Loader } from 'lucide-react';
import api from '../services/api';

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    resumeFile: null,
    coverLetter: '',
    portfolioLink: '',
    linkedinLink: '',
    githubLink: '',
    majorProjectLink: '',
    answers: {},
  });

  const [filePreview, setFilePreview] = useState('');

  useEffect(() => {
    fetchJobAndProfile();
  }, [id]);

  const fetchJobAndProfile = async () => {
    try {
      setLoading(true);
      const [jobRes, profileRes] = await Promise.all([
        api.get(`/jobs/${id}`),
        api.get('/profile'),
      ]);

      if (jobRes.data.success) setJob(jobRes.data.data);
      if (profileRes.data.success) setProfile(profileRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job or profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resumeFile: file }));
      setFilePreview(file.name);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setFormData((prev) => ({
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

    try {
      setSubmitting(true);

      // Create FormData for file upload
      const form = new FormData();
      if (formData.resumeFile) {
        form.append('resume', formData.resumeFile);
      }
      form.append('coverLetter', formData.coverLetter);
      form.append('portfolioLink', formData.portfolioLink);
      form.append('linkedinLink', formData.linkedinLink);
      form.append('githubLink', formData.githubLink);
      form.append('majorProjectLink', formData.majorProjectLink);

      // Add answers
      if (job?.customQuestions && job.customQuestions.length > 0) {
        form.append('answers', JSON.stringify(
          job.customQuestions.map((q, idx) => ({
            question: q.questionText,
            answer: formData.answers[idx] || '',
          }))
        ));
      }

      const response = await api.post(`/applications/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        navigate('/applications', {
          state: { message: 'Application submitted successfully!' },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
        <div className="text-center py-12">
          <p className="text-gray-600">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Job
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Job Summary */}
          <div className="mb-8 pb-8 border-b">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-gray-600 mb-4">{job.description?.substring(0, 100)}...</p>
            {job.requiredLinks && Object.keys(job.requiredLinks).length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">Required Links:</p>
                <div className="space-y-1 text-sm text-blue-800">
                  {job.requiredLinks.portfolio && <p>• Portfolio (Required)</p>}
                  {job.requiredLinks.linkedin && <p>• LinkedIn (Required)</p>}
                  {job.requiredLinks.github && <p>• GitHub (Required)</p>}
                  {job.requiredLinks.majorProject && <p>• Major Project (Required)</p>}
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Resume <span className="text-red-600">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition cursor-pointer bg-gray-50">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                  required
                />
                <label htmlFor="resume-upload" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900">
                    {filePreview || 'Click or drag to upload resume'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX (Max 10MB)</p>
                </label>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Cover Letter
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                placeholder="Tell the recruiter why you're interested in this role..."
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Social & Portfolio Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Portfolio Link
                </label>
                <input
                  type="url"
                  name="portfolioLink"
                  value={formData.portfolioLink}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedinLink"
                  value={formData.linkedinLink}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourprofile"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Major Project Link
                </label>
                <input
                  type="url"
                  name="majorProjectLink"
                  value={formData.majorProjectLink}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourproject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Custom Questions */}
            {job.customQuestions && job.customQuestions.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Application Questions
                </h3>
                <div className="space-y-4">
                  {job.customQuestions.map((question, idx) => (
                    <div key={idx}>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        {question.questionText}
                        {question.required && <span className="text-red-600"> *</span>}
                      </label>

                      {question.type === 'text' && (
                        <input
                          type="text"
                          value={formData.answers[idx] || ''}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          placeholder="Your answer"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required={question.required}
                        />
                      )}

                      {question.type === 'textarea' && (
                        <textarea
                          value={formData.answers[idx] || ''}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          placeholder="Your answer"
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required={question.required}
                        />
                      )}

                      {question.type === 'yes/no' && (
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${idx}`}
                              value="yes"
                              onChange={(e) => handleAnswerChange(idx, e.target.value)}
                              checked={formData.answers[idx] === 'yes'}
                            />
                            <span className="text-gray-700">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`question-${idx}`}
                              value="no"
                              onChange={(e) => handleAnswerChange(idx, e.target.value)}
                              checked={formData.answers[idx] === 'no'}
                            />
                            <span className="text-gray-700">No</span>
                          </label>
                        </div>
                      )}

                      {question.type === 'multiple-choice' && (
                        <select
                          value={formData.answers[idx] || ''}
                          onChange={(e) => handleAnswerChange(idx, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
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
};

export default ApplyJob;

