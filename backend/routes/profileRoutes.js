const express = require('express');
const {
  getRecruiterProfile,
  updateRecruiterProfile,
  getCompanyProfile,
  updateCompanyProfile,
  createCompanyProfile,
} = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(file.originalname.split('.').pop());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Recruiter Profile Routes
// @route   GET /api/recruiter/profile
// @desc    Get recruiter profile
// @access  Private
router.get('/profile', authMiddleware, getRecruiterProfile);

// @route   PUT /api/recruiter/profile
// @desc    Update recruiter profile with photo
// @access  Private
router.put('/profile', authMiddleware, upload.single('profilePhoto'), updateRecruiterProfile);

// Company Profile Routes
// @route   GET /api/recruiter/company-profile
// @desc    Get company profile
// @access  Private
router.get('/company-profile', authMiddleware, getCompanyProfile);

// @route   POST /api/recruiter/company-profile
// @desc    Create company profile
// @access  Private
router.post('/company-profile', authMiddleware, createCompanyProfile);

// @route   PUT /api/recruiter/company-profile
// @desc    Update company profile with logo
// @access  Private
router.put('/company-profile', authMiddleware, upload.single('companyLogo'), updateCompanyProfile);

module.exports = router;
