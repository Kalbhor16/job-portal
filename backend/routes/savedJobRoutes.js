const express = require('express');
const {
  saveJob,
  unsaveJob,
  getSavedJobs,
  checkJobSaved,
  updateSavedJobNotes,
  getSavedJobsCount,
} = require('../controllers/savedJobController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// All routes require authentication and job seeker role
router.use(authMiddleware, roleMiddleware('jobseeker'));

// @route   GET /api/saved-jobs
// @desc    Get all saved jobs
// @access  Private (Job Seeker)
router.get('/', getSavedJobs);

// @route   GET /api/saved-jobs/count
// @desc    Get saved jobs count
// @access  Private (Job Seeker)
router.get('/count', getSavedJobsCount);

// @route   GET /api/saved-jobs/check/:jobId
// @desc    Check if job is saved
// @access  Private (Job Seeker)
router.get('/check/:jobId', checkJobSaved);

// @route   POST /api/saved-jobs/:jobId
// @desc    Save a job
// @access  Private (Job Seeker)
router.post('/:jobId', saveJob);

// @route   DELETE /api/saved-jobs/:jobId
// @desc    Unsave a job
// @access  Private (Job Seeker)
router.delete('/:jobId', unsaveJob);

// @route   PUT /api/saved-jobs/:jobId/notes
// @desc    Update notes for saved job
// @access  Private (Job Seeker)
router.put('/:jobId/notes', updateSavedJobNotes);

module.exports = router;
