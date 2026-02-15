/**
 * Mock API Service for Recruiter Dashboard
 * Simulates API calls with realistic data
 */

// Mock Job Data
export const mockJobs = [
  {
    _id: '1',
    title: 'Senior React Developer',
    description: 'Looking for an experienced React developer',
    salaryMin: 80000,
    salaryMax: 120000,
    currency: 'USD',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    experienceLevel: '5+ years',
    status: 'Active',
    applications: 12,
    views: 245,
    deadline: '2026-03-15',
    createdAt: '2026-02-01',
  },
  {
    _id: '2',
    title: 'Product Manager',
    description: 'Leading product strategy and development',
    salaryMin: 100000,
    salaryMax: 150000,
    currency: 'USD',
    location: 'New York, NY',
    jobType: 'Full-time',
    experienceLevel: '7+ years',
    status: 'Active',
    applications: 8,
    views: 189,
    deadline: '2026-02-28',
    createdAt: '2026-02-03',
  },
  {
    _id: '3',
    title: 'UI/UX Designer',
    description: 'Design beautiful and intuitive user interfaces',
    salaryMin: 70000,
    salaryMax: 100000,
    currency: 'USD',
    location: 'Remote',
    jobType: 'Full-time',
    experienceLevel: '3-5 years',
    status: 'Draft',
    applications: 0,
    views: 0,
    deadline: '2026-03-20',
    createdAt: '2026-02-10',
  },
  {
    _id: '4',
    title: 'DevOps Engineer',
    description: 'Infrastructure and deployment specialist',
    salaryMin: 95000,
    salaryMax: 130000,
    currency: 'USD',
    location: 'Seattle, WA',
    jobType: 'Full-time',
    experienceLevel: '5+ years',
    status: 'Closed',
    applications: 25,
    views: 412,
    deadline: '2026-01-31',
    createdAt: '2026-01-15',
  },
];

// Mock Applicants Data
export const mockApplicants = [
  {
    _id: 'app1',
    name: 'John Smith',
    email: 'john@example.com',
    jobTitle: 'Senior React Developer',
    status: 'Interview Scheduled',
    appliedDate: '2026-02-05',
    resumeUrl: '#',
  },
  {
    _id: 'app2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    jobTitle: 'Senior React Developer',
    status: 'Shortlisted',
    appliedDate: '2026-02-06',
    resumeUrl: '#',
  },
  {
    _id: 'app3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    jobTitle: 'Product Manager',
    status: 'New',
    appliedDate: '2026-02-08',
    resumeUrl: '#',
  },
  {
    _id: 'app4',
    name: 'Emma Davis',
    email: 'emma@example.com',
    jobTitle: 'Senior React Developer',
    status: 'Reviewed',
    appliedDate: '2026-02-09',
    resumeUrl: '#',
  },
  {
    _id: 'app5',
    name: 'Alex Wilson',
    email: 'alex@example.com',
    jobTitle: 'UI/UX Designer',
    status: 'Rejected',
    appliedDate: '2026-02-07',
    resumeUrl: '#',
  },
];

// Mock API Functions
export const dashboardAPI = {
  // Fetch jobs
  getJobs: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          jobs: mockJobs,
          stats: {
            total: mockJobs.length,
            active: mockJobs.filter((j) => j.status === 'Active').length,
            draft: mockJobs.filter((j) => j.status === 'Draft').length,
            closed: mockJobs.filter((j) => j.status === 'Closed').length,
            totalApplications: mockJobs.reduce((sum, j) => sum + j.applications, 0),
            totalViews: mockJobs.reduce((sum, j) => sum + j.views, 0),
          },
        });
      }, 300);
    });
  },

  // Fetch applicants
  getApplicants: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          applicants: mockApplicants,
          stats: {
            total: mockApplicants.length,
            new: mockApplicants.filter((a) => a.status === 'New').length,
            reviewed: mockApplicants.filter((a) => a.status === 'Reviewed').length,
            shortlisted: mockApplicants.filter((a) => a.status === 'Shortlisted').length,
            scheduled: mockApplicants.filter((a) => a.status === 'Interview Scheduled').length,
            rejected: mockApplicants.filter((a) => a.status === 'Rejected').length,
            hired: mockApplicants.filter((a) => a.status === 'Hired').length,
          },
        });
      }, 300);
    });
  },

  // Update applicant status
  updateApplicantStatus: async (applicantId, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Applicant status updated to ${newStatus}`,
        });
      }, 200);
    });
  },

  // Close job
  closeJob: async (jobId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Job closed successfully',
        });
      }, 200);
    });
  },
};
