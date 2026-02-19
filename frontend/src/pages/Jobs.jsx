import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobSeekerHeader from '../components/JobSeekerHeader';
import { jobService, savedJobService } from '../services/apiService';
import { MapPin, DollarSign, Briefcase, BookOpen, Heart, AlertCircle, Loader } from 'lucide-react';

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    minSalary: '',
    maxSalary: '',
    isRemote: false,
    sortBy: 'newest'
  });

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 10,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '' && v !== false)
        )
      };
      const response = await jobService.getAllJobs(params);
      setJobs(response.jobs || []);
      setFilteredJobs(response.jobs || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      // savedJobService.getSavedJobs() returns an array of SavedJob documents
      // Each item has a populated `job` field. Extract job._id for quick lookup.
      const saved = await savedJobService.getSavedJobs();
      setSavedJobs(new Set(saved.map(s => (s.job && s.job._id) ? s.job._id : (s.job || s._id))));
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const handleSaveJob = async (jobId, e) => {
    e.stopPropagation();
    try {
      if (savedJobs.has(jobId)) {
        await savedJobService.unsaveJob(jobId);
        setSavedJobs(prev => {
          const updated = new Set(prev);
          updated.delete(jobId);
          return updated;
        });
      } else {
        await savedJobService.saveJob(jobId);
        setSavedJobs(prev => new Set([...prev, jobId]));
      }
    } catch (err) {
      console.error('Error saving job:', err);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    return `Up to $${max.toLocaleString()}`;
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'Full-Time': 'bg-blue-100 text-blue-800',
      'Part-Time': 'bg-yellow-100 text-yellow-800',
      'Contract': 'bg-purple-100 text-purple-800',
      'Internship': 'bg-green-100 text-green-800',
      'Remote': 'bg-teal-100 text-teal-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Jobs</h1>
          <p className="text-gray-600">Explore opportunities that match your skills</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Keyword Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
                <input
                  type="text"
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  placeholder="Job title, skills..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="City or region..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  name="jobType"
                  value={filters.jobType}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <select
                  name="experienceLevel"
                  value={filters.experienceLevel}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                </select>
              </div>

              {/* Min Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary</label>
                <input
                  type="number"
                  name="minSalary"
                  value={filters.minSalary}
                  onChange={handleFilterChange}
                  placeholder="Min..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Max Salary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary</label>
                <input
                  type="number"
                  name="maxSalary"
                  value={filters.maxSalary}
                  onChange={handleFilterChange}
                  placeholder="Max..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="salary-low">Salary: Low to High</option>
                </select>
              </div>

              {/* Remote Checkbox */}
              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isRemote"
                    checked={filters.isRemote}
                    onChange={handleFilterChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Remote Only</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters({
                    keyword: '',
                    location: '',
                    jobType: '',
                    experienceLevel: '',
                    minSalary: '',
                    maxSalary: '',
                    isRemote: false,
                    sortBy: 'newest'
                  });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Jobs List */}
        {!loading && filteredJobs.length > 0 && (
          <div className="space-y-4">
            {filteredJobs.map(job => (
              <div
                key={job._id}
                onClick={() => navigate(`/job-details/${job._id}`)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h2>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {job.company || 'Company Name'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleSaveJob(job._id, e)}
                    className={`p-2 rounded-full transition ${
                      savedJobs.has(job._id)
                        ? 'bg-red-50 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${savedJobs.has(job._id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {/* Job Type */}
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getJobTypeColor(job.jobType)}`}>
                      {job.jobType}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{job.location}</span>
                  </div>

                  {/* Salary */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{job.experienceLevel}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.requiredSkills?.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills?.length > 3 && (
                    <span className="inline-block text-xs text-gray-600">+{job.requiredSkills.length - 3} more</span>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/apply/${job._id}`)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredJobs.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-lg">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => fetchJobs(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchJobs(pageNum)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => fetchJobs(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
