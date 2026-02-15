const mongoose = require('mongoose');

// Custom Question Schema
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
  },
  type: {
    type: String,
    enum: ['text', 'textarea', 'yes/no', 'multiple-choice'],
    required: true,
  },
  options: {
    type: [String],
    default: [],
  },
  required: {
    type: Boolean,
    default: false,
  },
});

// Required Links Schema
const requiredLinksSchema = new mongoose.Schema({
  portfolio: {
    required: { type: Boolean, default: false },
    optional: { type: Boolean, default: false },
  },
  linkedin: {
    required: { type: Boolean, default: false },
    optional: { type: Boolean, default: false },
  },
  github: {
    required: { type: Boolean, default: false },
    optional: { type: Boolean, default: false },
  },
  majorProject: {
    required: { type: Boolean, default: false },
    optional: { type: Boolean, default: false },
  },
});

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a job location'],
      trim: true,
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    salary: {
      type: Number,
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    jobType: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-Time',
    },
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Mid', 'Senior', 'Lead'],
      default: 'Mid',
    },
    applicationDeadline: {
      type: Date,
    },
    customQuestions: {
      type: [questionSchema],
      default: [],
    },
    requiredLinks: {
      type: requiredLinksSchema,
      default: {
        portfolio: { required: false, optional: false },
        linkedin: { required: false, optional: false },
        github: { required: false, optional: false },
        majorProject: { required: false, optional: false },
      },
    },
    requirements: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Draft', 'Active'],
      default: 'Draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
