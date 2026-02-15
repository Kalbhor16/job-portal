import { useState } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Send,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  MapPin,
  Briefcase,
  Code,
  Clock,
  Link2,
} from 'lucide-react';
import RecruiterLayout from '../layouts/RecruiterLayout';
import SectionCard from '../components/PostJob/SectionCard';
import SkillsInput from '../components/PostJob/SkillsInput';
import CustomQuestionBuilder from '../components/PostJob/CustomQuestionBuilder';
import RequiredLinksToggle from '../components/PostJob/RequiredLinksToggle';
import api from '../services/api';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    jobType: 'Full-Time',
    experienceLevel: 'Mid',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    description: '',
    requiredSkills: [],
    applicationDeadline: '',
    customQuestions: [],
    requiredLinks: {
      portfolio: { required: false, optional: false },
      linkedin: { required: false, optional: false },
      github: { required: false, optional: false },
      majorProject: { required: false, optional: false },
    },
    status: 'Draft',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length < 50)
      newErrors.description = 'Description must be at least 50 characters';

    if (formData.salaryMin && formData.salaryMax && formData.salaryMin > formData.salaryMax) {
      newErrors.salary = 'Minimum salary cannot exceed maximum salary';
    }

    if (formData.applicationDeadline) {
      const deadline = new Date(formData.applicationDeadline);
      if (deadline < new Date()) {
        newErrors.applicationDeadline = 'Deadline cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle blur for touched fields
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Handle skills
  const handleAddSkill = (skill) => {
    if (skill.trim() && !formData.requiredSkills.includes(skill.trim())) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill.trim()],
      }));
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((_, i) => i !== index),
    }));
  };

  // Handle custom questions
  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      customQuestions: [
        ...prev.customQuestions,
        {
          questionText: '',
          type: 'text',
          options: [],
          required: false,
        },
      ],
    }));
  };

  const handleUpdateQuestion = (index, updatedQuestion) => {
    setFormData((prev) => ({
      ...prev,
      customQuestions: prev.customQuestions.map((q, i) => (i === index ? updatedQuestion : q)),
    }));
  };

  const handleRemoveQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      customQuestions: prev.customQuestions.filter((_, i) => i !== index),
    }));
  };

  // Handle required links
  const handleUpdateRequiredLinks = (linkType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      requiredLinks: {
        ...prev.requiredLinks,
        [linkType]: {
          ...prev.requiredLinks[linkType],
          [field]: value,
        },
      },
    }));
  };

  // Toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Draft submission
  const handleSaveDraft = async () => {
    setFormData((prev) => ({
      ...prev,
      status: 'Draft',
    }));
    await handleSubmit(true);
  };

  // Publish job
  const handlePublish = async () => {
    if (!validateForm()) {
      showToast('Please fix all errors before publishing', 'error');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      status: 'Active',
    }));
    await handleSubmit(false);
  };

  // Submit form
  const handleSubmit = async (isDraft = false) => {
    try {
      setLoading(true);
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        company: user.companyName || 'Your Company',
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : 0,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : 0,
        currency: formData.currency,
        requiredSkills: formData.requiredSkills,
        applicationDeadline: formData.applicationDeadline || null,
        customQuestions: formData.customQuestions,
        requiredLinks: formData.requiredLinks,
        status: isDraft ? 'Draft' : 'Active',
      };

      const response = await api.post('/jobs', payload);

      if (response.data.success) {
        showToast(isDraft ? 'Job saved as draft!' : 'Job published successfully!', 'success');
        // Reset form or redirect
        setFormData({
          title: '',
          location: '',
          jobType: 'Full-Time',
          experienceLevel: 'Mid',
          salaryMin: '',
          salaryMax: '',
          currency: 'USD',
          description: '',
          requiredSkills: [],
          applicationDeadline: '',
          customQuestions: [],
          requiredLinks: {
            portfolio: { required: false, optional: false },
            linkedin: { required: false, optional: false },
            github: { required: false, optional: false },
            majorProject: { required: false, optional: false },
          },
          status: 'Draft',
        });
        setErrors({});
        setTouched({});
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error submitting job', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-4 right-4 p-4 rounded-xl shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top ${
              toast.type === 'success'
                ? 'bg-green-600 text-white border border-green-700'
                : 'bg-red-600 text-white border border-red-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {toast.message}
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Post a New Job
            </h1>
            <p className="text-gray-600">
              Fill in the details below to create and publish a job posting
            </p>
          </div>

          {/* Main Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-32">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <SectionCard
                title="Basic Information"
                icon={<Briefcase size={20} />}
                description="Essential job details"
              >
                <div className="space-y-4">
                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="e.g., Senior React Developer"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white ${
                        errors.title && touched.title
                          ? 'border-red-500 bg-red-50'
                          : 'border-green-300 hover:border-green-400'
                      }`}
                    />
                    {errors.title && touched.title && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Location *
                    </label>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-green-600" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="e.g., San Francisco, CA"
                        className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white ${
                          errors.location && touched.location
                            ? 'border-red-500 bg-red-50'
                            : 'border-green-300 hover:border-green-400'
                        }`}
                      />
                    </div>
                    {errors.location && touched.location && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} /> {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Job Type & Experience Level */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Job Type
                      </label>
                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white font-medium"
                      >
                        <option>Full-Time</option>
                        <option>Part-Time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                        <option>Remote</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Experience Level
                      </label>
                      <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white font-medium"
                      >
                        <option>Entry</option>
                        <option>Mid</option>
                        <option>Senior</option>
                        <option>Lead</option>
                      </select>
                    </div>
                  </div>
                </div>
              </SectionCard>

              {/* Salary Information */}
              <SectionCard
                title="Salary Information"
                icon={<DollarSign size={20} />}
                description="Optional - Leave blank if not disclosing"
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Minimum Salary
                      </label>
                      <input
                        type="number"
                        name="salaryMin"
                        value={formData.salaryMin}
                        onChange={handleInputChange}
                        placeholder="50000"
                        className="w-full px-4 py-3 border-2 border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Maximum Salary
                      </label>
                      <input
                        type="number"
                        name="salaryMax"
                        value={formData.salaryMax}
                        onChange={handleInputChange}
                        placeholder="100000"
                        className="w-full px-4 py-3 border-2 border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-green-300 hover:border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white font-medium"
                      >
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                        <option>INR</option>
                      </select>
                    </div>
                  </div>
                  {errors.salary && touched.salaryMin && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.salary}
                    </p>
                  )}
                </div>
              </SectionCard>

              {/* Job Description */}
              <SectionCard
                title="Job Description"
                icon={<Code size={20} />}
                description="Provide detailed information about the role"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Describe the job role, responsibilities, and what you're looking for..."
                    rows="8"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all resize-none font-medium bg-white ${
                      errors.description && touched.description
                        ? 'border-red-500 bg-red-50'
                        : 'border-green-300 hover:border-green-400'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {errors.description && touched.description && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle size={14} /> {errors.description}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formData.description.length} / 5000 characters
                    </p>
                  </div>
                </div>
              </SectionCard>

              {/* Required Skills */}
              <SectionCard
                title="Required Skills"
                icon={<Code size={20} />}
                description="Add skills required for this position"
              >
                <SkillsInput
                  skills={formData.requiredSkills}
                  onAddSkill={handleAddSkill}
                  onRemoveSkill={handleRemoveSkill}
                />
              </SectionCard>

              {/* Application Deadline */}
              <SectionCard
                title="Application Deadline"
                icon={<Calendar size={20} />}
                description="When should applications close?"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Deadline (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-green-600" />
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      min={new Date().toISOString().split('T')[0]}
                      className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 transition-all bg-white font-medium ${
                        errors.applicationDeadline && touched.applicationDeadline
                          ? 'border-red-500 bg-red-50'
                          : 'border-green-300 hover:border-green-400'
                      }`}
                    />
                  </div>
                  {errors.applicationDeadline && touched.applicationDeadline && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.applicationDeadline}
                    </p>
                  )}
                </div>
              </SectionCard>

              {/* Required Links */}
              <SectionCard
                title="Required Links"
                icon={<Link2 size={20} />}
                description="Which documents should applicants provide?"
              >
                <RequiredLinksToggle
                  requiredLinks={formData.requiredLinks}
                  onChange={handleUpdateRequiredLinks}
                />
              </SectionCard>

              {/* Custom Questions */}
              <SectionCard
                title="Custom Questions"
                icon={<Clock size={20} />}
                description="Add screening questions for applicants"
              >
                <div className="space-y-4">
                  {formData.customQuestions.map((question, index) => (
                    <CustomQuestionBuilder
                      key={index}
                      question={question}
                      index={index}
                      onChange={(updatedQuestion) =>
                        handleUpdateQuestion(index, updatedQuestion)
                      }
                      onRemove={() => handleRemoveQuestion(index)}
                    />
                  ))}

                  <button
                    onClick={handleAddQuestion}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-green-400 rounded-lg text-green-600 hover:bg-green-50 transition-colors font-semibold"
                  >
                    <Plus size={18} />
                    Add Question
                  </button>
                </div>
              </SectionCard>

              {/* Job Status */}
              <SectionCard
                title="Job Status"
                icon={<Briefcase size={20} />}
                description="Save as draft or publish immediately"
              >
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-green-300 rounded-lg hover:bg-green-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="Draft"
                      checked={formData.status === 'Draft'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 accent-green-600"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Save as Draft</p>
                      <p className="text-sm text-gray-600">
                        You can publish this job later
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-green-300 rounded-lg hover:bg-green-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.status === 'Active'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 accent-green-600"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Publish Now</p>
                      <p className="text-sm text-gray-600">
                        Job will be visible to job seekers immediately
                      </p>
                    </div>
                  </label>
                </div>
              </SectionCard>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1 lg:sticky lg:top-8 h-fit">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Job Summary
                </h3>

                <div className="space-y-3 text-sm">
                  {formData.title && (
                    <div>
                      <p className="text-green-600 font-semibold">Title</p>
                      <p className="font-medium text-gray-900 truncate">
                        {formData.title}
                      </p>
                    </div>
                  )}

                  {formData.location && (
                    <div>
                      <p className="text-green-600 font-semibold">Location</p>
                      <p className="font-medium text-gray-900">
                        {formData.location}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-green-600 font-semibold">Job Type</p>
                    <p className="font-medium text-gray-900">{formData.jobType}</p>
                  </div>

                  <div>
                    <p className="text-green-600 font-semibold">Experience Level</p>
                    <p className="font-medium text-gray-900">
                      {formData.experienceLevel}
                    </p>
                  </div>

                  {(formData.salaryMin || formData.salaryMax) && (
                    <div>
                      <p className="text-green-600 font-semibold">Salary Range</p>
                      <p className="font-medium text-gray-900">
                        {formData.salaryMin && `${formData.currency} ${formData.salaryMin}`}
                        {formData.salaryMin && formData.salaryMax && ' - '}
                        {formData.salaryMax && `${formData.currency} ${formData.salaryMax}`}
                      </p>
                    </div>
                  )}

                  {formData.requiredSkills.length > 0 && (
                    <div>
                      <p className="text-green-600 font-semibold">Skills</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.requiredSkills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                        {formData.requiredSkills.length > 3 && (
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            +{formData.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.applicationDeadline && (
                    <div>
                      <p className="text-green-600 font-semibold">Deadline</p>
                      <p className="font-medium text-gray-900">
                        {new Date(formData.applicationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-green-200">
                    <p className="text-green-600 font-semibold mb-2">Status</p>
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${
                        formData.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {formData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-200 shadow-2xl">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-3 justify-end">
              <button
                onClick={handleSaveDraft}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 border-2 border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <Save size={18} />
                Save Draft
              </button>

              <button
                onClick={handlePublish}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
              >
                <Send size={18} />
                {loading ? 'Publishing...' : 'Publish Job'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default PostJob;
