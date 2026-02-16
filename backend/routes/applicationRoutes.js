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
const multer = require('multer');

const router = express.Router();

// Configure multer for resume uploads (PDF, DOC, DOCX)
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/resumes/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// @route   POST /api/applications/:jobId
// @desc    Apply to a job (Job Seeker only)
// @access  Private
router.post('/:jobId', authMiddleware, roleMiddleware('jobseeker'), upload.single('resume'), applyJob);

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
