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
      enum: ['Fresher', '1-2 Years', '3-5 Years', '5+ Years'],
      default: 'Fresher',
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one skill is required',
      },
    },
    location: { type: String, required: [true, 'Location is required'] },
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
