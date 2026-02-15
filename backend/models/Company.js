const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: null,
    },
    industry: {
      type: String,
      default: '',
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
      default: '1-10',
    },
    foundedYear: {
      type: Number,
      default: null,
    },
    website: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Please provide company location'],
      trim: true,
    },
    aboutCompany: {
      type: String,
      maxlength: 2000,
      default: '',
    },
    socialLinks: {
      linkedin: {
        type: String,
        default: '',
      },
      twitter: {
        type: String,
        default: '',
      },
      facebook: {
        type: String,
        default: '',
      },
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    profileCompletionPercentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Calculate profile completion percentage
companySchema.pre('save', function (next) {
  let completionScore = 0;
  const fields = [
    'companyName',
    'companyLogo',
    'industry',
    'companySize',
    'foundedYear',
    'website',
    'location',
    'aboutCompany',
  ];

  fields.forEach(field => {
    if (this[field] && this[field] !== '') {
      completionScore += 100 / fields.length;
    }
  });

  this.profileCompletionPercentage = Math.round(completionScore);
  next();
});

module.exports = mongoose.model('Company', companySchema);
