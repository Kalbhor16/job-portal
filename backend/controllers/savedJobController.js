const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const User = require('../models/User');

// @route   POST /api/saved-jobs/:jobId
// @desc    Save a job for later
// @access  Private (Job Seeker only)
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { notes } = req.body;

    // Validate job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if already saved
    const existingSavedJob = await SavedJob.findOne({
      user: req.user.id,
      job: jobId,
    });

    if (existingSavedJob) {
      return res.status(400).json({
        success: false,
        message: 'This job is already saved',
      });
    }

    // Save job
    const savedJob = await SavedJob.create({
      user: req.user.id,
      job: jobId,
      notes: notes || '',
    });

    // Add to user's savedJobs array
    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { savedJobs: jobId } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      savedJob: await savedJob.populate('job'),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save job',
      error: error.message,
    });
  }
};

// @route   DELETE /api/saved-jobs/:jobId
// @desc    Unsave a job
// @access  Private (Job Seeker only)
exports.unsaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find and delete saved job
    const savedJob = await SavedJob.findOneAndDelete({
      user: req.user.id,
      job: jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found',
      });
    }

    // Remove from user's savedJobs array
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedJobs: jobId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job removed from saved jobs',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove saved job',
      error: error.message,
    });
  }
};

// @route   GET /api/saved-jobs
// @desc    Get all saved jobs for user
// @access  Private (Job Seeker only)
exports.getSavedJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const totalSavedJobs = await SavedJob.countDocuments({ user: req.user.id });

    const savedJobs = await SavedJob.find({ user: req.user.id })
      .populate({
        path: 'job',
        match: search
          ? {
              $or: [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
              ],
            }
          : {},
      })
      .sort({ savedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Filter out null jobs that didn't match search
    const filteredSavedJobs = savedJobs.filter(saved => saved.job !== null);

    res.status(200).json({
      success: true,
      count: filteredSavedJobs.length,
      total: totalSavedJobs,
      page,
      pages: Math.ceil(totalSavedJobs / limit),
      savedJobs: filteredSavedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved jobs',
      error: error.message,
    });
  }
};

// @route   GET /api/saved-jobs/check/:jobId
// @desc    Check if a job is saved
// @access  Private (Job Seeker only)
exports.checkJobSaved = async (req, res) => {
  try {
    const { jobId } = req.params;

    const savedJob = await SavedJob.findOne({
      user: req.user.id,
      job: jobId,
    });

    res.status(200).json({
      success: true,
      isSaved: !!savedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check saved job status',
      error: error.message,
    });
  }
};

// @route   PUT /api/saved-jobs/:jobId/notes
// @desc    Update notes for a saved job
// @access  Private (Job Seeker only)
exports.updateSavedJobNotes = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { notes } = req.body;

    const savedJob = await SavedJob.findOneAndUpdate(
      { user: req.user.id, job: jobId },
      { notes },
      { new: true }
    ).populate('job');

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notes updated successfully',
      savedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notes',
      error: error.message,
    });
  }
};

// @route   GET /api/saved-jobs/count
// @desc    Get count of saved jobs
// @access  Private (Job Seeker only)
exports.getSavedJobsCount = async (req, res) => {
  try {
    const count = await SavedJob.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get saved jobs count',
      error: error.message,
    });
  }
};
