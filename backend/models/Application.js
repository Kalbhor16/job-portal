const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: String,
      default: '',
    },
    portfolioLink: {
      type: String,
      default: '',
    },
    linkedinLink: {
      type: String,
      default: '',
    },
    githubLink: {
      type: String,
      default: '',
    },
    majorProjectLink: {
      type: String,
      default: '',
    },
    answers: [
      {
        question: String,
        answer: String,
      },
    ],
    status: {
      type: String,
      enum: ['New', 'Reviewed', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired'],
      default: 'New',
    },
    interviewScheduledAt: {
      type: Date,
      default: null,
    },
    interviewMessage: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
applicationSchema.index({ job: 1, applicant: 1 });
applicationSchema.index({ recruiter: 1, createdAt: -1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
