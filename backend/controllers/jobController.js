const Job = require('../models/Job');

// @route   POST /api/jobs
// @desc    Create a new job posting (Recruiter only)
// @access  Private (Recruiter)
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salaryMin,
      salaryMax,
      currency,
      jobType,
      experienceLevel,
      requiredSkills,
      applicationDeadline,
      customQuestions,
      requiredLinks,
      status,
    } = req.body;

    // Validation
    if (!title || !description || !company || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (title, description, company, location)',
      });
    }

    // Validate salary range if provided
    if (salaryMin && salaryMax && salaryMin > salaryMax) {
      return res.status(400).json({
        success: false,
        message: 'Minimum salary cannot exceed maximum salary',
      });
    }

    // Validate application deadline
    if (applicationDeadline) {
      const deadline = new Date(applicationDeadline);
      if (deadline < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Application deadline cannot be in the past',
        });
      }
    }

    // Create job
    const job = await Job.create({
      title,
      description,
      company,
      location,
      salaryMin: salaryMin || 0,
      salaryMax: salaryMax || 0,
      currency: currency || 'USD',
      jobType: jobType || 'Full-Time',
      experienceLevel: experienceLevel || 'Mid',
      requiredSkills: requiredSkills || [],
      applicationDeadline: applicationDeadline || null,
      customQuestions: customQuestions || [],
      requiredLinks: requiredLinks || {
        portfolio: { required: false, optional: false },
        linkedin: { required: false, optional: false },
        github: { required: false, optional: false },
        majorProject: { required: false, optional: false },
      },
      status: status || 'Draft',
      createdBy: req.user.id,
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
    // Filter by status (only show Active jobs to public)
    const query = { status: 'Active' };

    const jobs = await Job.find(query)
      .populate('createdBy', 'name email companyName')
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

    const {
      title,
      description,
      company,
      location,
      salaryMin,
      salaryMax,
      currency,
      jobType,
      experienceLevel,
      requiredSkills,
      applicationDeadline,
      customQuestions,
      requiredLinks,
      status,
    } = req.body;

    // Validate salary range if provided
    if (salaryMin && salaryMax && salaryMin > salaryMax) {
      return res.status(400).json({
        success: false,
        message: 'Minimum salary cannot exceed maximum salary',
      });
    }

    // Update fields
    job.title = title ?? job.title;
    job.description = description ?? job.description;
    job.company = company ?? job.company;
    job.location = location ?? job.location;
    job.salaryMin = salaryMin ?? job.salaryMin;
    job.salaryMax = salaryMax ?? job.salaryMax;
    job.currency = currency ?? job.currency;
    job.jobType = jobType ?? job.jobType;
    job.experienceLevel = experienceLevel ?? job.experienceLevel;
    job.requiredSkills = requiredSkills ?? job.requiredSkills;
    job.applicationDeadline = applicationDeadline ?? job.applicationDeadline;
    job.customQuestions = customQuestions ?? job.customQuestions;
    job.requiredLinks = requiredLinks ?? job.requiredLinks;
    job.status = status ?? job.status;

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
