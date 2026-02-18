const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @route   POST /api/interviews
// @desc    Schedule an interview (Recruiter only)
// @access  Private
exports.scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      interviewType,
      scheduledAt,
      duration,
      meetingLink,
      location,
      description,
    } = req.body;

    // Validate required fields
    if (!applicationId || !interviewType || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'Please provide applicationId, interviewType, and scheduledAt',
      });
    }

    // Validate date
    const scheduleDate = new Date(scheduledAt);
    if (scheduleDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule interview in the past',
      });
    }

    // Validate interview type based on requirements
    if (interviewType === 'Online' && !meetingLink) {
      return res.status(400).json({
        success: false,
        message: 'Meeting link is required for online interviews',
      });
    }

    if (interviewType === 'Offline' && !location) {
      return res.status(400).json({
        success: false,
        message: 'Location is required for offline interviews',
      });
    }

    // Check if application exists and belongs to recruiter
    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    if (application.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized - you do not own this application',
      });
    }

    // Check if interview already exists
    const existingInterview = await Interview.findOne({ application: applicationId });
    if (existingInterview && existingInterview.status !== 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Interview already scheduled for this application',
      });
    }

    // Create interview
    const interview = await Interview.create({
      application: applicationId,
      job: application.job._id,
      recruiter: req.user.id,
      candidate: application.applicant,
      interviewType,
      scheduledAt: scheduleDate,
      duration: duration || 60,
      meetingLink: meetingLink || '',
      location: location || '',
      description: description || '',
    });

    // Update application status
    application.status = 'Interview Scheduled';
    await application.save();

    // Create notification for candidate
    await Notification.create({
      user: application.applicant,
      title: 'Interview Scheduled',
      message: `Your interview for ${application.job.title} has been scheduled for ${new Date(scheduledAt).toLocaleDateString()}`,
      type: 'interview',
      relatedId: interview._id,
      read: false,
    });

    // Populate and return interview
    const populatedInterview = await Interview.findById(interview._id)
      .populate('candidate', 'fullName email phone')
      .populate('recruiter', 'fullName email')
      .populate('job', 'title company');

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      interview: populatedInterview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to schedule interview',
      error: error.message,
    });
  }
};

// @route   GET /api/interviews/my
// @desc    Get all interviews for the candidate (Job Seeker)
// @access  Private
exports.getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ candidate: req.user.id })
      .populate('job', 'title company')
      .populate('recruiter', 'fullName email companyName')
      .sort({ scheduledAt: 1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interviews',
      error: error.message,
    });
  }
};

// @route   GET /api/interviews/job/:jobId
// @desc    Get all interviews for a job (Recruiter only)
// @access  Private
exports.getJobInterviews = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists and belongs to recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const interviews = await Interview.find({ job: jobId })
      .populate('candidate', 'fullName email phone')
      .populate('application')
      .sort({ scheduledAt: 1 });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interviews',
      error: error.message,
    });
  }
};

// @route   GET /api/interviews/:id
// @desc    Get interview details
// @access  Private
exports.getInterviewDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id)
      .populate('candidate', 'fullName email phone')
      .populate('recruiter', 'fullName email companyName')
      .populate('job', 'title company')
      .populate('application');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check authorization - candidate or recruiter
    if (
      interview.candidate.toString() !== req.user.id &&
      interview.recruiter.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interview details',
      error: error.message,
    });
  }
};

// @route   PUT /api/interviews/:id
// @desc    Update interview (Recruiter only)
// @access  Private
exports.updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviewType, scheduledAt, meetingLink, location, description, status, feedback, rating } = req.body;

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check authorization
    if (interview.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Update fields
    if (interviewType) interview.interviewType = interviewType;
    if (scheduledAt) {
      const scheduleDate = new Date(scheduledAt);
      if (scheduleDate < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot schedule interview in the past',
        });
      }
      interview.scheduledAt = scheduleDate;
    }
    if (meetingLink) interview.meetingLink = meetingLink;
    if (location) interview.location = location;
    if (description) interview.description = description;
    if (status && ['Scheduled', 'Completed', 'Cancelled', 'No-Show', 'Rescheduled'].includes(status)) {
      interview.status = status;
    }
    if (feedback) interview.feedback = feedback;
    if (rating !== undefined) interview.rating = rating;

    await interview.save();

    const updatedInterview = await Interview.findById(id)
      .populate('candidate', 'fullName email')
      .populate('recruiter', 'fullName email')
      .populate('job', 'title');

    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      interview: updatedInterview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update interview',
      error: error.message,
    });
  }
};

// @route   PUT /api/interviews/:id/confirm
// @desc    Confirm interview (Job Seeker only)
// @access  Private
exports.confirmInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check authorization
    if (interview.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    interview.candidateConfirmed = true;
    interview.candidateConfirmedAt = new Date();
    await interview.save();

    // Notify recruiter
    await Notification.create({
      user: interview.recruiter,
      title: 'Interview Confirmed',
      message: 'Candidate has confirmed the interview',
      type: 'interview',
      relatedId: interview._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      message: 'Interview confirmed successfully',
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to confirm interview',
      error: error.message,
    });
  }
};

// @route   PUT /api/interviews/:id/reschedule
// @desc    Request interview reschedule (Job Seeker only)
// @access  Private
exports.requestReschedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, proposedDate } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for rescheduling',
      });
    }

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check authorization
    if (interview.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    interview.rescheduleRequested = true;
    interview.rescheduleReason = reason;
    if (proposedDate) {
      const proposed = new Date(proposedDate);
      if (proposed < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Proposed date cannot be in the past',
        });
      }
      interview.proposedRescheduleDate = proposed;
    }
    await interview.save();

    // Notify recruiter
    await Notification.create({
      user: interview.recruiter,
      title: 'Interview Reschedule Request',
      message: `Candidate requested to reschedule the interview. Reason: ${reason}`,
      type: 'interview',
      relatedId: interview._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      message: 'Reschedule request sent to recruiter',
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to request reschedule',
      error: error.message,
    });
  }
};

// @route   PUT /api/interviews/:id/cancel
// @desc    Cancel interview
// @access  Private (Both recruiter and candidate)
exports.cancelInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check authorization
    const isRecruiter = interview.recruiter.toString() === req.user.id;
    const isCandidate = interview.candidate.toString() === req.user.id;

    if (!isRecruiter && !isCandidate) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    interview.status = 'Cancelled';
    interview.notes = reason || interview.notes;
    await interview.save();

    // Notify the other party
    const notifyUser = isRecruiter ? interview.candidate : interview.recruiter;
    await Notification.create({
      user: notifyUser,
      title: 'Interview Cancelled',
      message: `Interview has been cancelled. Reason: ${reason || 'No reason provided'}`,
      type: 'interview',
      relatedId: interview._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      message: 'Interview cancelled successfully',
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel interview',
      error: error.message,
    });
  }
};

// @route   PUT /api/interviews/:id/complete
// @desc    Mark interview as completed (Recruiter only)
// @access  Private
exports.completeInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback, rating, notes } = req.body;

    const interview = await Interview.findById(id).populate('application');
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check authorization
    if (interview.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    interview.status = 'Completed';
    if (feedback) interview.feedback = feedback;
    if (rating) interview.rating = rating;
    if (notes) interview.notes = notes;
    await interview.save();

    // Notify candidate
    await Notification.create({
      user: interview.candidate,
      title: 'Interview Completed',
      message: 'Your interview has been marked as completed',
      type: 'interview',
      relatedId: interview._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      message: 'Interview marked as completed',
      interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to complete interview',
      error: error.message,
    });
  }
};

// @route   DELETE /api/interviews/:id
// @desc    Delete interview (Recruiter only for future use)
// @access  Private
exports.deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Check authorization
    if (interview.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await Interview.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete interview',
      error: error.message,
    });
  }
};
