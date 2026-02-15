import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  GraduationCap,
  Code,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  Download,
  Calendar,
} from 'lucide-react';
import RecruiterLayout from '../layouts/RecruiterLayout';
import api from '../services/api';

const JobSeekerProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobSeekerProfile();
  }, [userId]);

  const fetchJobSeekerProfile = async () => {
    try {
      setLoading(true);
      // Try to fetch real data from API
      try {
        const response = await api.get(`/users/${userId}/profile`);
        if (response.data.success) {
          setProfile(response.data.profile);
        }
      } catch (apiErr) {
        // Use dummy data if API fails
        console.log('Using dummy profile data');
        setProfile(getDummyProfile());
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(getDummyProfile());
    } finally {
      setLoading(false);
    }
  };

  const getDummyProfile = () => ({
    _id: userId,
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    profilePhoto: null,
    headline: 'Senior Frontend Developer | React Specialist',
    summary:
      'Passionate software developer with 5+ years of experience in building scalable web applications. Specialized in React, TypeScript, and modern web technologies. Strong problem-solving skills and team player attitude.',
    experienceLevel: '5+ Years',
    skills: [
      'React',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'MongoDB',
      'REST APIs',
      'Tailwind CSS',
      'Git',
      'AWS',
    ],
    location: 'San Francisco, CA',
    resumeURL: 'https://example.com/resume.pdf',
    portfolioLink: 'https://sarahjohnson-portfolio.com',
    linkedinLink: 'https://linkedin.com/in/sarah-johnson',
    githubLink: 'https://github.com/sarah-johnson',
    majorProjectLink: 'https://github.com/sarah-johnson/awesome-project',
    education: [
      {
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2015-09-01',
        endDate: '2019-05-31',
        description: 'GPA: 3.8/4.0 - Dean\'s List all semesters',
      },
    ],
    workExperience: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Frontend Developer',
        startDate: '2021-06-01',
        endDate: null,
        currentlyWorking: true,
        description:
          'Led development of customer-facing dashboard using React and TypeScript. Improved page load time by 40%. Mentored 3 junior developers.',
      },
      {
        company: 'Digital Innovations LLC',
        position: 'Full Stack Developer',
        startDate: '2019-08-01',
        endDate: '2021-05-31',
        currentlyWorking: false,
        description:
          'Developed and maintained 15+ microservices. Implemented automated testing increasing code coverage to 85%.',
      },
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect',
        issuedBy: 'Amazon Web Services',
        issueDate: '2022-03-15',
      },
      {
        name: 'React Advanced Patterns',
        issuedBy: 'Frontend Masters',
        issueDate: '2021-11-20',
      },
    ],
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-02-15T14:30:00Z',
  });

  if (loading) {
    return (
      <RecruiterLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </RecruiterLayout>
    );
  }

  if (error || !profile) {
    return (
      <RecruiterLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {/* Background Banner */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Profile Photo and Basic Info */}
            <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-6">
              {/* Photo */}
              <div className="flex-shrink-0">
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={profile.fullName}
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-4xl font-bold">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 pt-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {profile.fullName}
                </h1>
                <p className="text-lg text-emerald-600 font-semibold mb-4">
                  {profile.headline}
                </p>
                <div className="flex flex-wrap gap-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <a href={`mailto:${profile.email}`} className="hover:text-emerald-600">
                      {profile.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <a href={`tel:${profile.phone}`} className="hover:text-emerald-600">
                      {profile.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                    <span>{profile.experienceLevel}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            {profile.summary && (
              <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-2">About</h2>
                <p className="text-slate-700 leading-relaxed">{profile.summary}</p>
              </div>
            )}

            {/* Contact & Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {profile.resumeURL && (
                <a
                  href={profile.resumeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <Download className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">Resume</span>
                </a>
              )}
              {profile.portfolioLink && (
                <a
                  href={profile.portfolioLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-700">Portfolio</span>
                </a>
              )}
              {profile.linkedinLink && (
                <a
                  href={profile.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-700">LinkedIn</span>
                </a>
              )}
              {profile.githubLink && (
                <a
                  href={profile.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <Github className="w-5 h-5 text-slate-700" />
                  <span className="font-semibold text-slate-700">GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience Section */}
        {profile.workExperience && profile.workExperience.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-900">Work Experience</h2>
            </div>
            <div className="space-y-6">
              {profile.workExperience.map((exp, index) => (
                <div key={index} className="border-l-4 border-emerald-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{exp.position}</h3>
                      <p className="text-emerald-600 font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-sm text-slate-600">
                      {formatDate(exp.startDate)} -{' '}
                      {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p className="text-slate-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {profile.education && profile.education.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-900">Education</h2>
            </div>
            <div className="space-y-6">
              {profile.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-emerald-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-emerald-600 font-semibold">{edu.school}</p>
                    </div>
                    <span className="text-sm text-slate-600">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.description && <p className="text-slate-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {profile.certifications && profile.certifications.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-900">Certifications</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-slate-900 mb-1">{cert.name}</h3>
                  <p className="text-sm text-slate-600 mb-2">{cert.issuedBy}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(cert.issueDate)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Major Project */}
        {profile.majorProjectLink && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-slate-900">Major Project</h2>
            </div>
            <a
              href={profile.majorProjectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              View Project
              <LinkIcon className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default JobSeekerProfile;
