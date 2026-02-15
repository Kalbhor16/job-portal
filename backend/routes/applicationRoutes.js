const express = require('express');
const {
  applyJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
  getApplicationDetails,
  scheduleInterview,
  rejectApplication,
  rateApplicant,
} = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// @route   POST /api/applications/:jobId
// @desc    Apply to a job (Job Seeker only)
// @access  Private
router.post('/:jobId', authMiddleware, roleMiddleware('jobseeker'), applyJob);

// @route   GET /api/applications/job/:jobId
// @desc    Get applicants for a job (Recruiter only)
// @access  Private
router.get('/job/:jobId', authMiddleware, roleMiddleware('recruiter'), getJobApplications);

// @route   GET /api/applications/my
// @desc    Get my applications (Job Seeker)
// @access  Private
router.get('/my', authMiddleware, roleMiddleware('jobseeker'), getMyApplications);

// @route   GET /api/applications/:id
// @desc    Get single application details (Recruiter only)
// @access  Private
router.get('/:id', authMiddleware, roleMiddleware('recruiter'), getApplicationDetails);

// @route   PUT /api/applications/:id/status
// @desc    Update application status (Recruiter only)
// @access  Private
router.put('/:id/status', authMiddleware, roleMiddleware('recruiter'), updateApplicationStatus);

// @route   PATCH /api/applications/:id/schedule-interview
// @desc    Schedule interview for applicant (Recruiter only)
// @access  Private
router.patch('/:id/schedule-interview', authMiddleware, roleMiddleware('recruiter'), scheduleInterview);

// @route   PATCH /api/applications/:id/reject
// @desc    Reject an application (Recruiter only)
// @access  Private
router.patch('/:id/reject', authMiddleware, roleMiddleware('recruiter'), rejectApplication);

// @route   PATCH /api/applications/:id/rate
// @desc    Rate an applicant (Recruiter only)
// @access  Private
router.patch('/:id/rate', authMiddleware, roleMiddleware('recruiter'), rateApplicant);

module.exports = router;
