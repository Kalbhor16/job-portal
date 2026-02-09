import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editId = params.get('edit');
  const [isEditing, setIsEditing] = useState(!!editId);

  useEffect(() => {
    if (editId) {
      const fetchJob = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/jobs/${editId}`);
          const job = res.data.job;
          setFormData({
            title: job.title || '',
            company: job.company || '',
            location: job.location || '',
            salary: job.salary || '',
            description: job.description || '',
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load job for editing');
        } finally {
          setLoading(false);
        }
      };

      fetchJob();
    }
  }, [editId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Job title must be at least 3 characters';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    } else if (formData.company.trim().length < 2) {
      newErrors.company = 'Company name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Job description must be at least 10 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    }

    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (isNaN(formData.salary) || formData.salary < 0) {
      newErrors.salary = 'Salary must be a valid number';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form before submission
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      if (isEditing && editId) {
        const response = await api.put(`/jobs/${editId}`, {
          ...formData,
          salary: Number(formData.salary),
        });
        if (response.data.success) {
          setSuccess('✅ Job updated successfully! Redirecting...');
          setTimeout(() => navigate('/recruiter'), 1200);
        }
      } else {
        // Call create job API
        const response = await api.post('/jobs', {
          ...formData,
          salary: Number(formData.salary),
        });

        if (response.data.success) {
          setSuccess('✅ Job posted successfully! Redirecting to recruiter dashboard...');
          setFormData({
            title: '',
            company: '',
            location: '',
            salary: '',
            description: '',
          });
          setErrors({});

          // Redirect to recruiter dashboard after 1.2 seconds
          setTimeout(() => {
            navigate('/recruiter');
          }, 1200);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || '❌ Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="recruiter">
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-emerald-700">{isEditing ? '✏️ Edit Job' : '📝 Post a New Job'}</h1>
              <p className="text-sm text-gray-600">{isEditing ? 'Update the job details and save changes.' : 'Fill in the details to attract qualified candidates.'}</p>
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}
          {success && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">💼 Job Title</label>
              <input
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
              />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">🏢 Company Name</label>
                <input
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${errors.company ? 'border-red-400' : 'border-gray-200'}`}
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g., Tech Corp"
                />
                {errors.company && <p className="text-xs text-red-600 mt-1">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">📍 Location</label>
                <input
                  className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${errors.location ? 'border-red-400' : 'border-gray-200'}`}
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., San Francisco, CA"
                />
                {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">💰 Annual Salary (USD)</label>
              <input
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${errors.salary ? 'border-red-400' : 'border-gray-200'}`}
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g., 150000"
                min="0"
              />
              {errors.salary && <p className="text-xs text-red-600 mt-1">{errors.salary}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">📄 Job Description</label>
              <textarea
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${errors.description ? 'border-red-400' : 'border-gray-200'}`}
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job role, responsibilities, and requirements..."
                rows="6"
              ></textarea>
              {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? 'Saving...' : isEditing ? 'Save Changes' : '🚀 Post Job'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/recruiter')}
                className="px-4 py-2 border rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-4 text-sm text-gray-600">💡 <strong>Pro Tip:</strong> Be descriptive and clear about the job requirements to attract quality candidates!</div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PostJob;
