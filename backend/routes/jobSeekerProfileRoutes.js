const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getMyProfile,
  getProfileById,
  updateProfile,
  addEducation,
  updateEducation,
  deleteEducation,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  addSkill,
  deleteSkill,
} = require('../controllers/jobSeekerProfileController');

const router = express.Router();

// Configure multer for profile photo and resume uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'profilePhoto') {
        cb(null, 'uploads/photos/');
      } else if (file.fieldname === 'resume') {
        cb(null, 'uploads/resumes/');
      }
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profilePhoto') {
      const allowedTypes = /jpeg|jpg|png|webp/;
      const mimetype = allowedTypes.test(file.mimetype);
      const extname = allowedTypes.test(file.originalname.split('.').pop());

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'));
      }
    } else if (file.fieldname === 'resume') {
      const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedMimes.includes(file.mimetype)) {
        return cb(null, true);
      } else {
        cb(new Error('Only PDF and Word documents are allowed'));
      }
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// @route   GET /api/profile
// @desc    Get my profile
// @access  Private
router.get('/', authMiddleware, getMyProfile);

// @route   GET /api/profile/:userId
// @desc    Get profile by user ID (public)
// @access  Public
router.get('/:userId', getProfileById);

// @route   PUT /api/profile
// @desc    Update profile with photo/resume upload or JSON data
// @access  Private
// Use multer.none() to handle JSON requests, but still accept file uploads
router.put('/', authMiddleware, upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), updateProfile);

// Education routes
// @route   POST /api/profile/education
// @desc    Add education
// @access  Private
router.post('/education', authMiddleware, addEducation);

// @route   PUT /api/profile/education/:eduId
// @desc    Update education
// @access  Private
router.put('/education/:eduId', authMiddleware, updateEducation);

// @route   DELETE /api/profile/education/:eduId
// @desc    Delete education
// @access  Private
router.delete('/education/:eduId', authMiddleware, deleteEducation);

// Work experience routes
// @route   POST /api/profile/work-experience
// @desc    Add work experience
// @access  Private
router.post('/work-experience', authMiddleware, addWorkExperience);

// @route   PUT /api/profile/work-experience/:expId
// @desc    Update work experience
// @access  Private
router.put('/work-experience/:expId', authMiddleware, updateWorkExperience);

// @route   DELETE /api/profile/work-experience/:expId
// @desc    Delete work experience
// @access  Private
router.delete('/work-experience/:expId', authMiddleware, deleteWorkExperience);

// Skills routes
// @route   POST /api/profile/skills
// @desc    Add skill
// @access  Private
router.post('/skills', authMiddleware, addSkill);

// @route   DELETE /api/profile/skills/:skill
// @desc    Delete skill
// @access  Private
router.delete('/skills/:skill', authMiddleware, deleteSkill);

module.exports = router;
