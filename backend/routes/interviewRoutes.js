const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  scheduleInterview,
  getMyInterviews,
  getJobInterviews,
  getInterviewDetails,
  updateInterview,
  confirmInterview,
  requestReschedule,
  cancelInterview,
  completeInterview,
  deleteInterview,
} = require('../controllers/interviewController');

const router = express.Router();

// Middleware for protected routes
router.use(authMiddleware);

// Schedule interview (Recruiter only)
router.post('/', roleMiddleware('recruiter'), scheduleInterview);

// Get my interviews (Job Seeker)
router.get('/my/interviews', getMyInterviews);

// Get job interviews (Recruiter only)
router.get('/job/:jobId', roleMiddleware('recruiter'), getJobInterviews);

// Get interview details
router.get('/:id', getInterviewDetails);

// Update interview (Recruiter only)
router.put('/:id', roleMiddleware('recruiter'), updateInterview);

// Confirm interview (Job Seeker only)
router.put('/:id/confirm', roleMiddleware('jobseeker'), confirmInterview);

// Request reschedule (Job Seeker only)
router.put('/:id/reschedule', roleMiddleware('jobseeker'), requestReschedule);

// Cancel interview
router.put('/:id/cancel', cancelInterview);

// Complete interview (Recruiter only)
router.put('/:id/complete', roleMiddleware('recruiter'), completeInterview);

// Delete interview (Recruiter only)
router.delete('/:id', roleMiddleware('recruiter'), deleteInterview);

module.exports = router;
