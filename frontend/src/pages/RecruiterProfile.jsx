import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterLayout from '../layouts/RecruiterLayout';
import ProfileHeader from '../components/recruiter/ProfileHeader';
import FormInput from '../components/recruiter/FormInput';
import ImageUploader from '../components/recruiter/ImageUploader';
import { recruiterProfileAPI } from '../services/profileAPI';
import { Mail, Phone, Briefcase, Linkedin, ArrowLeft, Save, X } from 'lucide-react';

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    designation: 'HR Manager',
    bio: '',
    linkedinLink: '',
  });

  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState(null);

  const designations = [
    'HR Manager',
    'HR Executive',
    'Team Lead',
    'Founder',
    'CTO',
    'CEO',
    'Other',
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await recruiterProfileAPI.getProfile();
      if (response.success) {
        setProfile(response.data);
        setFormData({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          designation: response.data.designation || 'HR Manager',
          bio: response.data.bio || '',
          linkedinLink: response.data.linkedinLink || '',
        });
        if (response.data.profilePhoto) {
          setProfileImage(response.data.profilePhoto);
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (formData.linkedinLink && !isValidURL(formData.linkedinLink)) {
      newErrors.linkedinLink = 'Invalid LinkedIn URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const form = new FormData();

      form.append('fullName', formData.fullName);
      form.append('phone', formData.phone);
      form.append('designation', formData.designation);
      form.append('bio', formData.bio);
      form.append('linkedinLink', formData.linkedinLink);

      if (imageFile) {
        form.append('profilePhoto', imageFile);
      }

      const response = await recruiterProfileAPI.updateProfile(form);
      if (response.success) {
        setProfile(response.data);
        setIsEditing(false);
        setImageFile(null);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      alert(errorMessage);
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        designation: profile.designation || 'HR Manager',
        bio: profile.bio || '',
        linkedinLink: profile.linkedinLink || '',
      });
      setProfileImage(profile.profilePhoto || null);
      setImageFile(null);
    }
  };

  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {profile && (
          <>
            {/* Profile Header */}
            <ProfileHeader
              name={formData.fullName || 'Your Name'}
              title={formData.designation}
              image={profileImage}
              completionPercentage={profile.profileCompletionPercentage}
              lastUpdated={profile.updatedAt}
              onEditClick={() => setIsEditing(!isEditing)}
              isEditing={isEditing}
            />

            {!isEditing ? (
              // View Mode
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Contact Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Email</p>
                        <p className="text-slate-900 break-all">{formData.email}</p>
                      </div>
                    </div>
                    {formData.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-slate-500 font-semibold uppercase">Phone</p>
                          <p className="text-slate-900">{formData.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Professional Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Designation</p>
                        <p className="text-slate-900">{formData.designation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Social Links</h3>
                  <div className="space-y-4">
                    {formData.linkedinLink ? (
                      <div className="flex items-start gap-3">
                        <Linkedin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-slate-500 font-semibold uppercase">LinkedIn</p>
                          <a
                            href={formData.linkedinLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 break-all text-sm"
                          >
                            View Profile
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm">No LinkedIn profile added</p>
                    )}
                  </div>
                </div>
              </div>

              // Bio Card
            ) : null}

            {!isEditing && formData.bio && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Bio</h3>
                <p className="text-slate-700 leading-relaxed">{formData.bio}</p>
              </div>
            )}

            {/* Edit Form */}
            {isEditing && (
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Profile</h2>

                <div className="mb-6">
                  <ImageUploader
                    label="Profile Photo"
                    onImageChange={handleImageChange}
                    currentImage={profileImage}
                    imageType="profile"
                    error={errors.profilePhoto}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    error={errors.fullName}
                  />

                  <FormInput
                    label="Email"
                    name="email"
                    value={formData.email}
                    type="email"
                    disabled
                    className="bg-slate-100"
                  />

                  <FormInput
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />

                  <div className="mb-4">
                    <label htmlFor="designation" className="block text-sm font-semibold text-slate-700 mb-2">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {designations.map((des) => (
                        <option key={des} value={des}>
                          {des}
                        </option>
                      ))}
                    </select>
                  </div>

                  <FormInput
                    label="LinkedIn Profile"
                    name="linkedinLink"
                    value={formData.linkedinLink}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    error={errors.linkedinLink}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="bio" className="block text-sm font-semibold text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself (max 500 characters)"
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">{formData.bio.length}/500 characters</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterProfile;
