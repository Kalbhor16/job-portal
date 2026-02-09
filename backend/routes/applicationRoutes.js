const express = require('express');
const {
  applyJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
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

// @route   PUT /api/applications/:id/status
// @desc    Update application status (Recruiter only)
// @access  Private
router.put('/:id/status', authMiddleware, roleMiddleware('recruiter'), updateApplicationStatus);

module.exports = router;
