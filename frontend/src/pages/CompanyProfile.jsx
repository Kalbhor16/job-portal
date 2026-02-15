import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterLayout from '../layouts/RecruiterLayout';
import ProfileHeader from '../components/recruiter/ProfileHeader';
import FormInput from '../components/recruiter/FormInput';
import ImageUploader from '../components/recruiter/ImageUploader';
import { companyProfileAPI } from '../services/profileAPI';
import {
  ArrowLeft,
  Save,
  X,
  Building2,
  MapPin,
  Users,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Calendar,
  Plus,
} from 'lucide-react';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [hasCompany, setHasCompany] = useState(true);

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '1-10',
    foundedYear: '',
    website: '',
    location: '',
    aboutCompany: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [company, setCompany] = useState(null);

  const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await companyProfileAPI.getProfile();
      if (response.success && response.data) {
        setCompany(response.data);
        setFormData({
          companyName: response.data.companyName || '',
          industry: response.data.industry || '',
          companySize: response.data.companySize || '1-10',
          foundedYear: response.data.foundedYear || '',
          website: response.data.website || '',
          location: response.data.location || '',
          aboutCompany: response.data.aboutCompany || '',
          socialLinks: response.data.socialLinks || {
            linkedin: '',
            twitter: '',
            facebook: '',
          },
        });
        if (response.data.companyLogo) {
          setLogoImage(response.data.companyLogo);
        }
        setHasCompany(true);
      } else {
        setHasCompany(false);
        setFormData({
          companyName: '',
          industry: '',
          companySize: '1-10',
          foundedYear: '',
          website: '',
          location: '',
          aboutCompany: '',
          socialLinks: {
            linkedin: '',
            twitter: '',
            facebook: '',
          },
        });
      }
    } catch (err) {
      console.error('Error fetching company profile:', err);
      setHasCompany(false);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.website && !isValidURL(formData.website)) {
      newErrors.website = 'Invalid website URL';
    }

    if (formData.socialLinks.linkedin && !isValidURL(formData.socialLinks.linkedin)) {
      newErrors.linkedin = 'Invalid LinkedIn URL';
    }

    if (formData.socialLinks.twitter && !isValidURL(formData.socialLinks.twitter)) {
      newErrors.twitter = 'Invalid Twitter URL';
    }

    if (formData.socialLinks.facebook && !isValidURL(formData.socialLinks.facebook)) {
      newErrors.facebook = 'Invalid Facebook URL';
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

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (file) => {
    setLogoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const form = new FormData();

      form.append('companyName', formData.companyName);
      form.append('industry', formData.industry);
      form.append('companySize', formData.companySize);
      form.append('foundedYear', formData.foundedYear);
      form.append('website', formData.website);
      form.append('location', formData.location);
      form.append('aboutCompany', formData.aboutCompany);
      form.append('socialLinks', JSON.stringify(formData.socialLinks));

      if (logoFile) {
        form.append('companyLogo', logoFile);
      }

      let response;
      if (hasCompany) {
        response = await companyProfileAPI.updateProfile(form);
      } else {
        // For new company, we might need a different endpoint
        response = await companyProfileAPI.updateProfile(form);
      }

      if (response.success) {
        setCompany(response.data);
        setIsEditing(false);
        setLogoFile(null);
        setHasCompany(true);
        alert('Company profile updated successfully!');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update company profile';
      alert(errorMessage);
      console.error('Error updating company profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (company) {
      setFormData({
        companyName: company.companyName || '',
        industry: company.industry || '',
        companySize: company.companySize || '1-10',
        foundedYear: company.foundedYear || '',
        website: company.website || '',
        location: company.location || '',
        aboutCompany: company.aboutCompany || '',
        socialLinks: company.socialLinks || {
          linkedin: '',
          twitter: '',
          facebook: '',
        },
      });
      setLogoImage(company.companyLogo || null);
      setLogoFile(null);
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

        {!hasCompany && !isEditing ? (
          // No Company State
          <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-8">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Company Profile Yet</h2>
            <p className="text-slate-600 mb-6">Create your company profile to start posting jobs</p>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Company Profile
            </button>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            {company && (
              <ProfileHeader
                name={formData.companyName || 'Your Company'}
                title={formData.industry}
                image={logoImage}
                completionPercentage={company.profileCompletionPercentage}
                lastUpdated={company.updatedAt}
                onEditClick={() => setIsEditing(!isEditing)}
                isEditing={isEditing}
              />
            )}

            {!isEditing ? (
              // View Mode
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Basic Info Card */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Basic Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-slate-500 font-semibold uppercase">Company Name</p>
                          <p className="text-slate-900">{formData.companyName}</p>
                        </div>
                      </div>

                      {formData.industry && (
                        <div>
                          <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Industry</p>
                          <p className="text-slate-900">{formData.industry}</p>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-slate-500 font-semibold uppercase">Location</p>
                          <p className="text-slate-900">{formData.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Details Card */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Company Details</h3>
                    <div className="space-y-4">
                      {formData.companySize && (
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Company Size</p>
                            <p className="text-slate-900">{formData.companySize} employees</p>
                          </div>
                        </div>
                      )}

                      {formData.foundedYear && (
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Founded</p>
                            <p className="text-slate-900">{formData.foundedYear}</p>
                          </div>
                        </div>
                      )}

                      {formData.website && (
                        <div className="flex items-start gap-3">
                          <Globe className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Website</p>
                            <a
                              href={formData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 break-all text-sm"
                            >
                              {formData.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* About Company */}
                {formData.aboutCompany && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">About Company</h3>
                    <p className="text-slate-700 leading-relaxed">{formData.aboutCompany}</p>
                  </div>
                )}

                {/* Social Links */}
                {(formData.socialLinks.linkedin ||
                  formData.socialLinks.twitter ||
                  formData.socialLinks.facebook) && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Social Links</h3>
                    <div className="flex flex-wrap gap-4">
                      {formData.socialLinks.linkedin && (
                        <a
                          href={formData.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Linkedin className="w-5 h-5 text-blue-600" />
                          <span className="text-blue-700 font-semibold">LinkedIn</span>
                        </a>
                      )}
                      {formData.socialLinks.twitter && (
                        <a
                          href={formData.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors"
                        >
                          <Twitter className="w-5 h-5 text-sky-600" />
                          <span className="text-sky-700 font-semibold">Twitter</span>
                        </a>
                      )}
                      {formData.socialLinks.facebook && (
                        <a
                          href={formData.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Facebook className="w-5 h-5 text-indigo-600" />
                          <span className="text-indigo-700 font-semibold">Facebook</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : null}

            {/* Edit Form */}
            {isEditing && (
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  {hasCompany ? 'Edit Company Profile' : 'Create Company Profile'}
                </h2>

                <div className="mb-6">
                  <ImageUploader
                    label="Company Logo"
                    onImageChange={handleImageChange}
                    currentImage={logoImage}
                    imageType="company"
                    error={errors.logo}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <FormInput
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                    required
                    error={errors.companyName}
                  />

                  <FormInput
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="e.g., Technology, Finance, Healthcare"
                  />

                  <FormInput
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                    required
                    error={errors.location}
                  />

                  <div className="mb-4">
                    <label htmlFor="companySize" className="block text-sm font-semibold text-slate-700 mb-2">
                      Company Size
                    </label>
                    <select
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {companySizes.map((size) => (
                        <option key={size} value={size}>
                          {size} employees
                        </option>
                      ))}
                    </select>
                  </div>

                  <FormInput
                    label="Founded Year"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="YYYY"
                  />

                  <FormInput
                    label="Website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.example.com"
                    error={errors.website}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="aboutCompany" className="block text-sm font-semibold text-slate-700 mb-2">
                    About Company
                  </label>
                  <textarea
                    id="aboutCompany"
                    name="aboutCompany"
                    value={formData.aboutCompany}
                    onChange={handleInputChange}
                    placeholder="Tell us about your company (max 2000 characters)"
                    maxLength={2000}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">{formData.aboutCompany.length}/2000 characters</p>
                </div>

                {/* Social Links Section */}
                <div className="bg-slate-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                      label="LinkedIn"
                      name="linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={handleSocialLinkChange}
                      placeholder="https://linkedin.com/company/..."
                      error={errors.linkedin}
                    />
                    <FormInput
                      label="Twitter"
                      name="twitter"
                      value={formData.socialLinks.twitter}
                      onChange={handleSocialLinkChange}
                      placeholder="https://twitter.com/..."
                      error={errors.twitter}
                    />
                    <FormInput
                      label="Facebook"
                      name="facebook"
                      value={formData.socialLinks.facebook}
                      onChange={handleSocialLinkChange}
                      placeholder="https://facebook.com/..."
                      error={errors.facebook}
                    />
                  </div>
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

export default CompanyProfile;
