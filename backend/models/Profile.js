const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  fieldOfStudy: String,
  startDate: Date,
  endDate: Date,
  grade: String,
  description: String,
});

const experienceSchema = new mongoose.Schema({
  company: String,
  title: String,
  location: String,
  startDate: Date,
  endDate: Date,
  currentlyWorking: { type: Boolean, default: false },
  description: String,
});

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profilePhoto: { type: String, default: '' },
    headline: { type: String, default: '' },
    summary: { type: String, default: '' },
    experienceLevel: {
      type: String,
      enum: ['Intern', 'Entry', 'Mid', 'Senior', 'Lead', 'Manager', 'Director', 'Executive'],
      default: 'Entry',
    },
    skills: [{ type: String }],
    location: { type: String, default: '' },
    resumeURL: { type: String, default: '' },
    portfolioLink: { type: String, default: '' },
    linkedinLink: { type: String, default: '' },
    githubLink: { type: String, default: '' },
    majorProjectLink: { type: String, default: '' },
    education: [educationSchema],
    workExperience: [experienceSchema],
    certifications: [{ type: String }],
  },
  { timestamps: true }
);

profileSchema.index({ userId: 1 });

module.exports = mongoose.model('Profile', profileSchema);
