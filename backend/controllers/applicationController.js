const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @route   POST /api/applications/:jobId
// @desc    Apply to a job (Job Seeker only)
// @access  Private
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resumeUrl, coverLetter } = req.body;

    // Validation
    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: 'Resume URL is required' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      resumeUrl,
      coverLetter: coverLetter || '',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message,
    });
  }
};

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a job (Recruiter only)
// @access  Private
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists and belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message,
    });
  }
};

// @route   GET /api/applications/my
// @desc    Get all applications by job seeker
// @access  Private
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location salary createdAt')
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your applications',
      error: error.message,
    });
  }
};

// @route   PUT /api/applications/:id/status
// @desc    Update application status (Recruiter only)
// @access  Private
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await Application.findById(id).populate('job');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify recruiter owns the job
    if (application.job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application status updated',
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message,
    });
  }
};
