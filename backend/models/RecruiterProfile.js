const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    designation: {
      type: String,
      enum: ['HR Manager', 'HR Executive', 'Team Lead', 'Founder', 'CTO', 'CEO', 'Other'],
      default: 'HR Manager',
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    linkedinLink: {
      type: String,
      default: '',
    },
    profileCompletionPercentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Calculate profile completion percentage
recruiterProfileSchema.pre('save', function (next) {
  let completionScore = 0;
  const fields = ['fullName', 'email', 'phone', 'profilePhoto', 'designation', 'companyId', 'bio', 'linkedinLink'];
  
  fields.forEach(field => {
    if (this[field] && this[field] !== '') {
      completionScore += 100 / fields.length;
    }
  });

  this.profileCompletionPercentage = Math.round(completionScore);
  next();
});

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
