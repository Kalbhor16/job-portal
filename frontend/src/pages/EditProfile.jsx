import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Trash2, Loader, Save, ArrowLeft } from 'lucide-react';
import JobSeekerHeader from '../components/JobSeekerHeader';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/apiService';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    headline: '',
    summary: '',
    location: '',
    experienceLevel: 'Fresher',
    skills: [],
    portfolioLink: '',
    linkedinLink: '',
    githubLink: '',
    majorProjectLink: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [education, setEducation] = useState([]);
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: '',
  });

  const [workExperience, setWorkExperience] = useState([]);
  const [newExperience, setNewExperience] = useState({
    company: '',
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
  });

  const [files, setFiles] = useState({
    profilePhoto: null,
    resume: null,
  });

  useEffect(() => {
    // Fetch profile when component mounts
    // ProtectedRoute already ensures user is authenticated
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await profileService.getMyProfile();
      // Handle both response.data and direct response
      const p = response.data?.data || response.data || response;
      setProfile(p);
      setFormData({
        fullName: p.fullName || '',
        phone: p.phone || '',
        headline: p.headline || '',
        summary: p.summary || '',
        location: p.location || '',
        experienceLevel: p.experienceLevel || 'Fresher',
        skills: p.skills || [],
        portfolioLink: p.portfolioLink || '',
        linkedinLink: p.linkedinLink || '',
        githubLink: p.githubLink || '',
        majorProjectLink: p.majorProjectLink || '',
      });
      setEducation(p.education || []);
      setWorkExperience(p.workExperience || []);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList[0]) {
      setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleAddEducation = async () => {
    if (!newEducation.institution || !newEducation.degree) {
      setError('Institution and degree are required');
      return;
    }
    try {
      const response = await api.post('/profile/education', newEducation);
      if (response.data.success) {
        setEducation(response.data.data.education);
        setNewEducation({
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          grade: '',
        });
        setSuccess('Education added successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add education');
    }
  };

  const handleDeleteEducation = async (eduId) => {
    try {
      const response = await api.delete(`/profile/education/${eduId}`);
      if (response.data.success) {
        setEducation(response.data.data.education);
        setSuccess('Education deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete education');
    }
  };

  const handleAddExperience = async () => {
    if (!newExperience.company || !newExperience.title) {
      setError('Company and title are required');
      return;
    }
    try {
      const response = await api.post('/profile/work-experience', newExperience);
      if (response.data.success) {
        setWorkExperience(response.data.data.workExperience);
        setNewExperience({
          company: '',
          title: '',
          location: '',
          startDate: '',
          endDate: '',
          currentlyWorking: false,
          description: '',
        });
        setSuccess('Work experience added successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add work experience');
    }
  };

  const handleDeleteExperience = async (expId) => {
    try {
      const response = await api.delete(`/profile/work-experience/${expId}`);
      if (response.data.success) {
        setWorkExperience(response.data.data.workExperience);
        setSuccess('Work experience deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete work experience');
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.fullName || !formData.phone) {
      setError('Full name and phone are required');
      return;
    }

    if (!formData.location || formData.location.trim() === '') {
      setError('Location is required');
      return;
    }

    if (!Array.isArray(formData.skills) || formData.skills.length === 0) {
      setError('Please add at least one skill');
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      const profileData = {
        fullName: formData.fullName,
        phone: formData.phone,
        headline: formData.headline || '',
        summary: formData.summary || '',
        experienceLevel: formData.experienceLevel || 'Fresher',
        skills: Array.isArray(formData.skills) ? formData.skills : [formData.skills].filter(Boolean),
        location: formData.location || '',
        portfolioLink: formData.portfolioLink || '',
        linkedinLink: formData.linkedinLink || '',
        githubLink: formData.githubLink || '',
        majorProjectLink: formData.majorProjectLink || '',
      };

      let response;
      
      // If there are files, use FormData; otherwise use JSON
      if (files.profilePhoto || files.resume) {
        const form = new FormData();
        Object.keys(profileData).forEach((key) => {
          if (key === 'skills') {
            form.append(key, profileData[key].join(','));
          } else {
            form.append(key, profileData[key]);
          }
        });
        if (files.profilePhoto) form.append('profilePhoto', files.profilePhoto);
        if (files.resume) form.append('resume', files.resume);
        
        console.log('Saving profile with files...');
        response = await profileService.updateProfile(form);
      } else {
        console.log('Saving profile without files...');
        response = await profileService.updateProfile(profileData);
      }
      
      console.log('Save response:', response);
      setSuccess('Profile updated successfully');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.message || err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <>
      <JobSeekerHeader />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-green-100 rounded-lg transition flex items-center gap-2 text-green-600"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Your Profile</h1>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-8">
            {/* Basic Info */}
            <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Headline
                </label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Developer | React Specialist"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Professional Summary
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </section>

            {/* Experience Level */}
            <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience Level</h2>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option>Intern</option>
              <option>Entry</option>
              <option>Mid</option>
              <option>Senior</option>
              <option>Lead</option>
              <option>Manager</option>
              <option>Director</option>
              <option>Executive</option>
            </select>
          </section>

            {/* File Uploads */}
            <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">File Uploads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Profile Photo
                </label>
                <input
                  type="file"
                  name="profilePhoto"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {profile?.profilePhoto && (
                  <p className="text-xs text-gray-500 mt-2">Current: {profile.profilePhoto}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Resume (PDF/DOC)
                </label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {profile?.resumeURL && (
                  <p className="text-xs text-gray-500 mt-2">Current: {profile.resumeURL}</p>
                )}
              </div>
            </div>
          </section>

            {/* Links */}
            <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Social & Portfolio Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="url"
                name="portfolioLink"
                value={formData.portfolioLink}
                onChange={handleInputChange}
                placeholder="Portfolio"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="url"
                name="linkedinLink"
                value={formData.linkedinLink}
                onChange={handleInputChange}
                placeholder="LinkedIn"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                placeholder="GitHub"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="url"
                name="majorProjectLink"
                value={formData.majorProjectLink}
                onChange={handleInputChange}
                placeholder="Major Project"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </section>

            {/* Skills */}
            <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add a skill and press Enter"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <div
                  key={skill}
                  className="bg-green-100 text-green-900 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-green-600 hover:text-green-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>

            {/* Education */}
            <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
            {education.map((edu) => (
              <div key={edu._id} className="mb-4 p-4 bg-gray-50 rounded-lg flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{edu.degree}</p>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">
                    {edu.startDate && new Date(edu.startDate).getFullYear()} -{' '}
                    {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteEducation(edu._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <div className="border rounded-lg p-4 space-y-3">
              <input
                type="text"
                value={newEducation.institution}
                onChange={(e) =>
                  setNewEducation((prev) => ({ ...prev, institution: e.target.value }))
                }
                placeholder="Institution"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={newEducation.degree}
                onChange={(e) => setNewEducation((prev) => ({ ...prev, degree: e.target.value }))}
                placeholder="Degree"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={newEducation.fieldOfStudy}
                onChange={(e) =>
                  setNewEducation((prev) => ({ ...prev, fieldOfStudy: e.target.value }))
                }
                placeholder="Field of Study"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={newEducation.startDate}
                  onChange={(e) =>
                    setNewEducation((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="date"
                  value={newEducation.endDate}
                  onChange={(e) =>
                    setNewEducation((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddEducation}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Education
              </button>
            </div>
          </section>

            {/* Work Experience */}
            <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Work Experience</h2>
            {workExperience.map((exp) => (
              <div key={exp._id} className="mb-4 p-4 bg-gray-50 rounded-lg flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{exp.title}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500">
                    {exp.startDate && new Date(exp.startDate).toLocaleDateString()} -{' '}
                    {exp.currentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteExperience(exp._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <div className="border rounded-lg p-4 space-y-3">
              <input
                type="text"
                value={newExperience.company}
                onChange={(e) =>
                  setNewExperience((prev) => ({ ...prev, company: e.target.value }))
                }
                placeholder="Company"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={newExperience.title}
                onChange={(e) => setNewExperience((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Job Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={newExperience.location}
                onChange={(e) =>
                  setNewExperience((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="Location"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={newExperience.startDate}
                  onChange={(e) =>
                    setNewExperience((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="date"
                  value={newExperience.endDate}
                  onChange={(e) =>
                    setNewExperience((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  disabled={newExperience.currentlyWorking}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newExperience.currentlyWorking}
                  onChange={(e) =>
                    setNewExperience((prev) => ({ ...prev, currentlyWorking: e.target.checked }))
                  }
                />
                <span className="text-gray-700">I currently work here</span>
              </label>
              <textarea
                value={newExperience.description}
                onChange={(e) =>
                  setNewExperience((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Job description"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={handleAddExperience}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Experience
              </button>
            </div>
          </section>

            {/* Save Button */}
            <div className="flex gap-4 pt-6 border-t">
              <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Profile
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;

