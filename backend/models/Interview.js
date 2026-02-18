const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interviewType: {
      type: String,
      enum: ['Online', 'Offline', 'Phone'],
      default: 'Online',
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },
    meetingLink: {
      type: String, // Zoom, Google Meet, Teams link
      default: '',
    },
    location: {
      type: String, // Physical location for offline interviews
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show', 'Rescheduled'],
      default: 'Scheduled',
    },
    feedback: {
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
    candidateConfirmed: {
      type: Boolean,
      default: false,
    },
    candidateConfirmedAt: {
      type: Date,
      default: null,
    },
    rescheduleRequested: {
      type: Boolean,
      default: false,
    },
    rescheduleReason: {
      type: String,
      default: '',
    },
    proposedRescheduleDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries
interviewSchema.index({ job: 1, recruiter: 1 });
interviewSchema.index({ candidate: 1, scheduledAt: -1 });
interviewSchema.index({ application: 1 });
interviewSchema.index({ status: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
