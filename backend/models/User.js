const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['jobseeker', 'recruiter'],
      default: 'jobseeker',
    },
    companyName: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    headline: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
    experienceLevel: {
      type: String,
      enum: ['Internship', 'Entry', 'Mid', 'Senior', 'Lead', 'Director', 'Other'],
      default: 'Entry',
    },
    skills: [{ type: String }],
    location: {
      type: String,
      default: '',
    },
    resumeURL: {
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
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        fieldOfStudy: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    workExperience: [
      {
        title: { type: String },
        company: { type: String },
        location: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    certifications: [{ type: String }],
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
