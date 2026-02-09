const Job = require('../models/Job');

// @route   POST /api/jobs
// @desc    Create a new job posting (Recruiter only)
// @access  Private (Recruiter)
exports.createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;

    // Validation
    if (!title || !description || !company || !location || !salary) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create job
    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      createdBy: req.user.id, // User ID from auth middleware
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message,
    });
  }
};

// @route   GET /api/jobs
// @desc    Get all job listings (Public)
// @access  Public
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message,
    });
  }
};

// @route   GET /api/jobs/:id
// @desc    Get job by id (Public)
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch job', error: error.message });
  }
};

// @route   PUT /api/jobs/:id
// @desc    Update a job posting (Recruiter only - owner)
// @access  Private (Recruiter)
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Only creator can update
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only update your own job postings' });
    }

    const { title, description, company, location, salary } = req.body;
    job.title = title ?? job.title;
    job.description = description ?? job.description;
    job.company = company ?? job.company;
    job.location = location ?? job.location;
    job.salary = salary ?? job.salary;

    await job.save();

    res.status(200).json({ success: true, message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update job', error: error.message });
  }
};

// @route   GET /api/jobs/my
// @desc    Get jobs posted by recruiter (Recruiter only)
// @access  Private (Recruiter)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your jobs',
      error: error.message,
    });
  }
};

// @route   DELETE /api/jobs/:id
// @desc    Delete a job posting (Recruiter only - own posts)
// @access  Private (Recruiter)
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Find job
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if user is the job creator
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own job postings',
      });
    }

    // Delete job
    await Job.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message,
    });
  }
};
