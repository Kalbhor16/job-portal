import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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

        // Check if user has already applied (if job seeker)
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
    return <div className="text-center py-20">Loading job details...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded max-w-2xl mx-auto mt-6">{error}</div>;
  }

  if (!job) {
    return <div className="text-center py-20">Job not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-700">{job.title}</h1>
            <p className="text-lg text-gray-600">{job.company}</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded text-sm font-semibold">
            {job.jobType}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm font-semibold">{job.location}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Salary</p>
            <p className="text-sm font-semibold">${job.salary?.toLocaleString()} USD</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Posted</p>
            <p className="text-sm font-semibold">{new Date(job.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Applications</p>
            <p className="text-sm font-semibold">-</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h2 className="text-lg font-semibold mb-2">Requirements</h2>
            <ul className="list-disc list-inside space-y-1">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="text-gray-700">
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {user?.role === 'jobseeker' && !hasApplied && (
          <form onSubmit={handleApply} className="border-t pt-4 mt-4">
            <h2 className="text-lg font-semibold mb-4">Apply for this job</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Resume URL</label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://example.com/resume.pdf"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cover Letter (optional)</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the recruiter about yourself..."
                  rows="4"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={applying}
                className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-60"
              >
                {applying ? 'Submitting...' : '✅ Submit Application'}
              </button>
            </div>
          </form>
        )}

        {hasApplied && (
          <div className="border-t pt-4 mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 font-semibold">✅ You have already applied for this job</p>
          </div>
        )}

        {user?.role === 'recruiter' && (
          <div className="border-t pt-4 mt-4">
            <button
              onClick={() => navigate(`/applicants/${jobId}`)}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              View Applicants
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
