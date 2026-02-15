import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  FileText,
  Link as LinkIcon,
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Linkedin,
  Github,
  Globe,
  Clock,
  Star,
  GraduationCap,
  Code,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';
import RecruiterLayout from '../layouts/RecruiterLayout';
import StatusBadge from '../components/recruiter/StatusBadge';
import InfoCard from '../components/recruiter/InfoCard';
import ActionButton from '../components/recruiter/ActionButton';
import SectionHeader from '../components/recruiter/SectionHeader';
import { mockApplicationData } from '../utils/mockData';

const ApplicantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State Management
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useMockData, setUseMockData] = useState(true); // Use mock data by default
  const [expandedSections, setExpandedSections] = useState({
    coverLetter: false,
    questions: true,
    links: true,
    experience: true,
    education: true,
    skills: true,
    resume: true,
    profile: true,
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    interviewDate: '',
    interviewMessage: '',
    rejectionReason: '',
  });

  // Fetch Application Details
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Try to fetch real data from API
        try {
          const response = await api.get(`/applications/${id}`);
          if (response.data.success) {
            setApplication(response.data.application);
            setUseMockData(false);
            setFormData((prev) => ({
              ...prev,
              status: response.data.application.status,
            }));
          }
        } catch (apiErr) {
          // If API fails, use mock data
          console.log('Using mock data for demonstration');
          setApplication(mockApplicationData);
          setUseMockData(true);
          setFormData((prev) => ({
            ...prev,
            status: mockApplicationData.status,
          }));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching application');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  // Toggle Section Expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Update Status Handler
  const handleUpdateStatus = async () => {
    if (!formData.status) return;

    try {
      setActionLoading(true);
      const response = await api.put(`/applications/${id}/status`, {
        status: formData.status,
      });

      if (response.data.success) {
        setApplication(response.data.application);
        setShowStatusModal(false);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Schedule Interview Handler
  const handleScheduleInterview = async () => {
    if (!formData.interviewDate) return;

    try {
      setActionLoading(true);
      const response = await api.patch(`/applications/${id}/schedule-interview`, {
        interviewDate: formData.interviewDate,
        interviewMessage: formData.interviewMessage,
      });

      if (response.data.success) {
        setApplication(response.data.application);
        setShowInterviewModal(false);
      }
    } catch (err) {
      console.error('Error scheduling interview:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Reject Application Handler
  const handleRejectApplication = async () => {
    try {
      setActionLoading(true);
      const response = await api.patch(`/applications/${id}/reject`, {
        rejectionReason: formData.rejectionReason,
      });

      if (response.data.success) {
        setApplication(response.data.application);
        setShowRejectModal(false);
      }
    } catch (err) {
      console.error('Error rejecting application:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-600">Loading applicant details...</p>
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <RecruiterLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-900">{error}</h3>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-secondary-200 hover:bg-secondary-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </RecruiterLayout>
    );
  }

  if (!application) {
    return (
      <RecruiterLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-secondary-600">Application not found</p>
        </div>
      </RecruiterLayout>
    );
  }

  const { applicant, job, resumeUrl, coverLetter, answers } = application;

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-secondary-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-3 py-2 text-secondary-600 hover:text-primary-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Main Content */}
              <div className="md:col-span-8">
                {/* Candidate Header Card */}
                <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Profile Photo */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {applicant?.firstName?.charAt(0)}{applicant?.lastName?.charAt(0)}
                      </div>
                    </div>

                    {/* Candidate Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <h1 className="text-2xl font-bold text-secondary-900">
                            {applicant?.firstName} {applicant?.lastName}
                          </h1>
                          <p className="text-primary-600 font-medium mt-1">{applicant?.headline}</p>
                          <p className="text-secondary-600 flex items-center gap-1 mt-2">
                            <MapPin className="w-4 h-4" />
                            {applicant?.location}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div>
                          <StatusBadge status={application.status} size="lg" />
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-secondary-100">
                        <InfoCard label="Email" value={applicant?.email} icon={Mail} />
                        <InfoCard label="Phone" value={applicant?.phone} icon={Phone} />
                        <InfoCard
                          label="Applied"
                          value={new Date(application.appliedAt).toLocaleDateString()}
                          icon={Calendar}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Complete Profile Section */}
                <div className="bg-white rounded-xl shadow-soft overflow-hidden mb-6">
                  <button
                    onClick={() => toggleSection('profile')}
                    className="w-full p-6 flex items-center justify-between hover:bg-secondary-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Code className="w-6 h-6 text-primary-600 mt-1" />
                      <div className="text-left">
                        <h2 className="text-xl font-bold text-secondary-900">Complete Profile</h2>
                        <p className="text-sm text-secondary-600 mt-1">Bio, rating, and professional details</p>
                      </div>
                    </div>
                    {expandedSections.profile ? (
                      <ChevronUp className="w-5 h-5 text-secondary-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-secondary-600" />
                    )}
                  </button>

                  {expandedSections.profile && (
                    <div className="px-6 pb-6 border-t border-secondary-100 space-y-6">
                      {/* Bio */}
                      {applicant?.bio && (
                        <div>
                          <h3 className="text-sm font-semibold text-secondary-900 uppercase tracking-wide mb-2">
                            Professional Bio
                          </h3>
                          <p className="text-sm text-secondary-700 leading-relaxed">{applicant.bio}</p>
                        </div>
                      )}

                      {/* Rating */}
                      {application.rating > 0 && (
                        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <div>
                            <p className="text-sm font-medium text-yellow-900">Recruiter Rating</p>
                            <p className="text-lg font-bold text-yellow-700">{application.rating}/5.0</p>
                          </div>
                        </div>
                      )}

                      {/* Recruiter Notes */}
                      {application.notes && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h3 className="text-sm font-semibold text-blue-900 mb-2">Recruiter Notes</h3>
                          <p className="text-sm text-blue-800">{application.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Experience Section */}
                {applicant?.experience && applicant.experience.length > 0 && (
                  <div className="bg-white rounded-xl shadow-soft overflow-hidden mb-6">
                    <button
                      onClick={() => toggleSection('experience')}
                      className="w-full p-6 flex items-center justify-between hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Briefcase className="w-6 h-6 text-primary-600 mt-1" />
                        <div className="text-left">
                          <h2 className="text-xl font-bold text-secondary-900">Work Experience</h2>
                          <p className="text-sm text-secondary-600 mt-1">{applicant.experience.length} positions</p>
                        </div>
                      </div>
                      {expandedSections.experience ? (
                        <ChevronUp className="w-5 h-5 text-secondary-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-secondary-600" />
                      )}
                    </button>

                    {expandedSections.experience && (
                      <div className="px-6 pb-6 border-t border-secondary-100">
                        <div className="space-y-6">
                          {applicant.experience.map((exp, index) => (
                            <div key={index} className="pb-6 border-b border-secondary-100 last:border-0 last:pb-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <h3 className="text-lg font-bold text-secondary-900">{exp.title}</h3>
                                  <p className="text-primary-600 font-medium">{exp.company}</p>
                                </div>
                                <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm rounded-full whitespace-nowrap">
                                  {exp.duration}
                                </span>
                              </div>
                              <p className="text-secondary-700 text-sm leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Education Section */}
                {applicant?.education && applicant.education.length > 0 && (
                  <div className="bg-white rounded-xl shadow-soft overflow-hidden mb-6">
                    <button
                      onClick={() => toggleSection('education')}
                      className="w-full p-6 flex items-center justify-between hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <GraduationCap className="w-6 h-6 text-primary-600 mt-1" />
                        <div className="text-left">
                          <h2 className="text-xl font-bold text-secondary-900">Education</h2>
                          <p className="text-sm text-secondary-600 mt-1">{applicant.education.length} qualifications</p>
                        </div>
                      </div>
                      {expandedSections.education ? (
                        <ChevronUp className="w-5 h-5 text-secondary-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-secondary-600" />
                      )}
                    </button>

                    {expandedSections.education && (
                      <div className="px-6 pb-6 border-t border-secondary-100">
                        <div className="space-y-6">
                          {applicant.education.map((edu, index) => (
                            <div key={index} className="pb-6 border-b border-secondary-100 last:border-0 last:pb-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div>
                                  <h3 className="text-lg font-bold text-secondary-900">{edu.degree}</h3>
                                  <p className="text-primary-600 font-medium">{edu.school}</p>
                                  <p className="text-secondary-600 text-sm mt-1">{edu.field}</p>
                                </div>
                                <span className="px-3 py-1 bg-secondary-100 text-secondary-700 text-sm rounded-full whitespace-nowrap">
                                  {edu.year}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Skills Section */}
                {applicant?.skills && applicant.skills.length > 0 && (
                  <div className="bg-white rounded-xl shadow-soft overflow-hidden mb-6">
                    <button
                      onClick={() => toggleSection('skills')}
                      className="w-full p-6 flex items-center justify-between hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Award className="w-6 h-6 text-primary-600 mt-1" />
                        <div className="text-left">
                          <h2 className="text-xl font-bold text-secondary-900">Skills & Expertise</h2>
                          <p className="text-sm text-secondary-600 mt-1">{applicant.skills.length} skills listed</p>
                        </div>
                      </div>
                      {expandedSections.skills ? (
                        <ChevronUp className="w-5 h-5 text-secondary-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-secondary-600" />
                      )}
                    </button>

                    {expandedSections.skills && (
                      <div className="px-6 pb-6 border-t border-secondary-100">
                        <div className="flex flex-wrap gap-2">
                          {applicant.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-4 py-2 bg-primary-100 text-primary-700 text-sm font-medium rounded-full border border-primary-300 hover:bg-primary-200 transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Certifications Section */}
                {applicant?.certifications && applicant.certifications.length > 0 && (
                  <div className="bg-white rounded-xl shadow-soft overflow-hidden mb-6">
                    <div className="p-6">
                      <SectionHeader
                        icon={Award}
                        title="Certifications"
                        description={`${applicant.certifications.length} certifications`}
                      />
                      <div className="space-y-2">
                        {applicant.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-secondary-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-primary-600" />
                            <span className="text-sm text-secondary-700">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
                  <SectionHeader
                    icon={Briefcase}
                    title="Job Details"
                    description={job?.title}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <InfoCard
                      label="Experience Level"
                      value={job?.experienceLevel || 'Not specified'}
                      icon={Award}
                    />
                    <InfoCard
                      label="Posted"
                      value={new Date(job?.createdAt).toLocaleDateString()}
                      icon={Calendar}
                    />
                  </div>

                  {job?.description && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-secondary-600 uppercase tracking-wide mb-2">
                        Description
                      </h3>
                      <p className="text-sm text-secondary-700 line-clamp-3">{job?.description}</p>
                    </div>
                  )}

                  {job?.skills && job.skills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-secondary-600 uppercase tracking-wide mb-2">
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full border border-primary-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cover Letter */}
                {coverLetter && (
                  <div className="bg-white rounded-xl shadow-soft overflow-hidden mb-6">
                    <button
                      onClick={() => toggleSection('coverLetter')}
                      className="w-full flex items-center justify-between p-6 hover:bg-secondary-50 transition-colors"
                    >
                      <SectionHeader
                        icon={FileText}
                        title="Cover Letter"
                        description={coverLetter.substring(0, 50) + '...'}
                      />
                      {expandedSections.coverLetter ? (
                        <ChevronUp className="w-5 h-5 text-secondary-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-secondary-600" />
                      )}
                    </button>

                    {expandedSections.coverLetter && (
                      <div className="px-6 pb-6 border-t border-secondary-100">
                        <p className="text-secondary-700 whitespace-pre-wrap text-sm leading-relaxed">
                          {coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Links Section */}
                {(application.portfolioLink ||
                  application.linkedinLink ||
                  application.githubLink ||
                  application.majorProjectLink) && (
                  <div className="bg-white rounded-xl shadow-soft overflow-hidden mb-6">
                    <button
                      onClick={() => toggleSection('links')}
                      className="w-full p-6 flex items-center justify-between hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <LinkIcon className="w-6 h-6 text-primary-600 mt-1" />
                        <div className="text-left">
                          <h2 className="text-xl font-bold text-secondary-900">Links</h2>
                          <p className="text-sm text-secondary-600 mt-1">Additional resources & profiles</p>
                        </div>
                      </div>
                      {expandedSections.links ? (
                        <ChevronUp className="w-5 h-5 text-secondary-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-secondary-600" />
                      )}
                    </button>

                    {expandedSections.links && (
                      <div className="px-6 pb-6 border-t border-secondary-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {application.portfolioLink && (
                            <a
                              href={application.portfolioLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors group"
                            >
                              <Globe className="w-5 h-5 text-primary-600 group-hover:text-primary-700" />
                              <div>
                                <p className="text-xs font-medium text-secondary-600">Portfolio</p>
                                <p className="text-sm text-primary-600 truncate group-hover:underline">
                                  {application.portfolioLink}
                                </p>
                              </div>
                            </a>
                          )}

                          {application.linkedinLink && (
                            <a
                              href={application.linkedinLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors group"
                            >
                              <Linkedin className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                              <div>
                                <p className="text-xs font-medium text-secondary-600">LinkedIn</p>
                                <p className="text-sm text-primary-600 truncate group-hover:underline">
                                  {application.linkedinLink}
                                </p>
                              </div>
                            </a>
                          )}

                          {application.githubLink && (
                            <a
                              href={application.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors group"
                            >
                              <Github className="w-5 h-5 text-secondary-900 group-hover:text-secondary-700" />
                              <div>
                                <p className="text-xs font-medium text-secondary-600">GitHub</p>
                                <p className="text-sm text-primary-600 truncate group-hover:underline">
                                  {application.githubLink}
                                </p>
                              </div>
                            </a>
                          )}

                          {application.majorProjectLink && (
                            <a
                              href={application.majorProjectLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors group"
                            >
                              <Award className="w-5 h-5 text-primary-600 group-hover:text-primary-700" />
                              <div>
                                <p className="text-xs font-medium text-secondary-600">Major Project</p>
                                <p className="text-sm text-primary-600 truncate group-hover:underline">
                                  {application.majorProjectLink}
                                </p>
                              </div>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Question Answers */}
                {answers && answers.length > 0 && (
                  <div className="bg-white rounded-xl shadow-soft overflow-hidden mb-6">
                    <button
                      onClick={() => toggleSection('questions')}
                      className="w-full p-6 flex items-center justify-between hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="w-6 h-6 text-primary-600 mt-1" />
                        <div className="text-left">
                          <h2 className="text-xl font-bold text-secondary-900">Custom Answers</h2>
                          <p className="text-sm text-secondary-600 mt-1">{answers.length} questions answered</p>
                        </div>
                      </div>
                      {expandedSections.questions ? (
                        <ChevronUp className="w-5 h-5 text-secondary-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-secondary-600" />
                      )}
                    </button>

                    {expandedSections.questions && (
                      <div className="px-6 pb-6 border-t border-secondary-100 space-y-6">
                        {answers.map((item, index) => (
                          <div key={index} className="pb-6 border-b border-secondary-100 last:border-0 last:pb-0">
                            <h3 className="font-medium text-secondary-900 mb-3">{item.question}</h3>
                            <p className="text-secondary-700 text-sm leading-relaxed whitespace-pre-wrap">
                              {item.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Resume Preview */}
                {resumeUrl && (
                  <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                    <button
                      onClick={() => toggleSection('resume')}
                      className="w-full p-6 flex items-center justify-between hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="w-6 h-6 text-primary-600 mt-1" />
                        <div className="text-left">
                          <h2 className="text-xl font-bold text-secondary-900">Resume/CV</h2>
                          <p className="text-sm text-secondary-600 mt-1">Download or view PDF</p>
                        </div>
                      </div>
                      {expandedSections.resume ? (
                        <ChevronUp className="w-5 h-5 text-secondary-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-secondary-600" />
                      )}
                    </button>

                    {expandedSections.resume && (
                      <div className="px-6 pb-6 border-t border-secondary-100">
                        <div className="mb-4 flex gap-3 flex-col sm:flex-row">
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors text-center inline-flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open PDF in New Tab
                          </a>
                          <a
                            href={resumeUrl}
                            download={`${applicant.firstName}-${applicant.lastName}-Resume.pdf`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-primary-300 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download PDF
                          </a>
                        </div>

                        {/* PDF Viewer */}
                        <div className="w-full bg-secondary-100 rounded-lg overflow-hidden border border-secondary-300">
                          <iframe
                            src={`${resumeUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                            title="Resume PDF"
                            className="w-full h-[600px] sm:h-[800px] border-none"
                            loading="lazy"
                          />
                        </div>

                        <p className="text-xs text-secondary-600 mt-4 text-center">
                          💡 Tip: Use the controls above to navigate, zoom, and download the PDF directly from the viewer.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar Actions - Sticky on Desktop */}
              <div className="md:col-span-4">
                <div className="sticky top-24 space-y-4">
                  {/* Demo Mode Badge */}
                  {useMockData && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">
                        📋 Demo Mode Active
                      </p>
                      <p className="text-sm text-blue-700">
                        Using sample data for demonstration. This shows all available features and complete applicant profile.
                      </p>
                    </div>
                  )}
                  {/* Status Info Card */}
                  <div className="bg-white rounded-xl shadow-soft p-6">
                    <h3 className="font-semibold text-secondary-900 mb-4">Application Status</h3>
                    <div className="mb-4">
                      <StatusBadge status={application.status} size="lg" />
                    </div>
                    <p className="text-xs text-secondary-600 mb-4">
                      Updated {new Date(application.updatedAt).toLocaleDateString()}
                    </p>
                    <ActionButton
                      label="Change Status"
                      variant="secondary"
                      fullWidth
                      onClick={() => setShowStatusModal(true)}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-white rounded-xl shadow-soft p-6 space-y-3">
                    <ActionButton
                      label="Schedule Interview"
                      icon={Calendar}
                      variant="primary"
                      fullWidth
                      onClick={() => setShowInterviewModal(true)}
                      disabled={
                        ['Rejected', 'Hired'].includes(application.status) ||
                        application.interviewScheduledAt
                      }
                    />
                    <ActionButton
                      label="Message Candidate"
                      icon={MessageSquare}
                      variant="secondary"
                      fullWidth
                      onClick={() => {
                        // Navigate to messages with candidate ID
                        navigate(`/recruiter/messages?candidate=${applicant._id}`);
                      }}
                    />
                    <ActionButton
                      label="Download Resume"
                      icon={Download}
                      variant="secondary"
                      fullWidth
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = resumeUrl;
                        a.download = `${applicant.firstName}-${applicant.lastName}-resume.pdf`;
                        a.click();
                      }}
                    />
                    <ActionButton
                      label="Reject"
                      icon={AlertCircle}
                      variant="danger"
                      fullWidth
                      onClick={() => setShowRejectModal(true)}
                      disabled={['Rejected', 'Hired'].includes(application.status)}
                    />
                  </div>

                  {/* Interview Info */}
                  {application.interviewScheduledAt && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-indigo-900">Interview Scheduled</h4>
                          <p className="text-sm text-indigo-700 mt-1">
                            {new Date(application.interviewScheduledAt).toLocaleString()}
                          </p>
                          {application.interviewMessage && (
                            <p className="text-sm text-indigo-600 mt-2">{application.interviewMessage}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-4">Change Application Status</h3>

              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Status</option>
                <option value="New">New</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Rejected">Rejected</option>
                <option value="Hired">Hired</option>
              </select>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={actionLoading || !formData.status}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interview Modal */}
        {showInterviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-secondary-900 mb-4">Schedule Interview</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Interview Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.interviewDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, interviewDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-900 mb-2">
                  Message for Candidate (Optional)
                </label>
                <textarea
                  value={formData.interviewMessage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, interviewMessage: e.target.value }))}
                  rows="3"
                  placeholder="Add interview details, meeting link, or any other info..."
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowInterviewModal(false)}
                  className="flex-1 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleInterview}
                  disabled={actionLoading || !formData.interviewDate}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-red-900 mb-2">Reject Application</h3>
              <p className="text-secondary-600 text-sm mb-4">
                This action cannot be undone. The applicant status will be changed to "Rejected".
              </p>

              <textarea
                value={formData.rejectionReason}
                onChange={(e) => setFormData((prev) => ({ ...prev, rejectionReason: e.target.value }))}
                rows="3"
                placeholder="Reason for rejection (optional)..."
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectApplication}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default ApplicantDetails;
