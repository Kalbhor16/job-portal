const RecruiterProfile = require('../models/RecruiterProfile');
const Company = require('../models/Company');
const User = require('../models/User');

// @route   GET /api/recruiter/profile
// @desc    Get recruiter profile
// @access  Private (Recruiter only)
exports.getRecruiterProfile = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    let profile = await RecruiterProfile.findOne({ userId: recruiterId }).populate('companyId');

    if (!profile) {
      // Create default profile if not exists
      const user = await User.findById(recruiterId);
      profile = await RecruiterProfile.create({
        userId: recruiterId,
        fullName: user.name,
        email: user.email,
        designation: 'HR Manager',
      });
      await profile.populate('companyId');
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recruiter profile',
      error: error.message,
    });
  }
};

// @route   PUT /api/recruiter/profile
// @desc    Update recruiter profile
// @access  Private (Recruiter only)
exports.updateRecruiterProfile = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { fullName, phone, designation, bio, linkedinLink } = req.body;

    // Validation
    if (!fullName || fullName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Full name is required',
      });
    }

    // URL validation
    if (linkedinLink && !isValidURL(linkedinLink)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid LinkedIn URL',
      });
    }

    let profile = await RecruiterProfile.findOne({ userId: recruiterId });

    if (!profile) {
      profile = new RecruiterProfile({
        userId: recruiterId,
        fullName,
        email: req.user.email,
      });
    }

    // Update fields
    profile.fullName = fullName;
    if (phone) profile.phone = phone;
    if (designation) profile.designation = designation;
    if (bio) profile.bio = bio;
    if (linkedinLink) profile.linkedinLink = linkedinLink;

    // Handle profile photo
    if (req.file) {
      if (!isValidImageSize(req.file.size)) {
        return res.status(400).json({
          success: false,
          message: 'Image size must be less than 5MB',
        });
      }
      profile.profilePhoto = req.file.path; // Cloudinary URL or local path
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating recruiter profile',
      error: error.message,
    });
  }
};

// @route   GET /api/recruiter/company-profile
// @desc    Get company profile
// @access  Private (Recruiter only)
exports.getCompanyProfile = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    let company = await Company.findOne({ recruiterId });

    if (!company) {
      return res.status(404).json({
        success: true,
        message: 'No company profile found',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching company profile',
      error: error.message,
    });
  }
};

// @route   PUT /api/recruiter/company-profile
// @desc    Create or update company profile
// @access  Private (Recruiter only)
exports.updateCompanyProfile = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const {
      companyName,
      industry,
      companySize,
      foundedYear,
      website,
      location,
      aboutCompany,
      socialLinks,
    } = req.body;

    // Validation
    if (!companyName || companyName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Company name is required',
      });
    }

    if (!location || location.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Location is required',
      });
    }

    // URL validations
    if (website && !isValidURL(website)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid website URL',
      });
    }

    if (socialLinks) {
      if (socialLinks.linkedin && !isValidURL(socialLinks.linkedin)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid LinkedIn URL',
        });
      }
      if (socialLinks.twitter && !isValidURL(socialLinks.twitter)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Twitter URL',
        });
      }
      if (socialLinks.facebook && !isValidURL(socialLinks.facebook)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Facebook URL',
        });
      }
    }

    let company = await Company.findOne({ recruiterId });

    if (!company) {
      company = new Company({
        recruiterId,
        companyName,
        location,
      });
    }

    // Update fields
    company.companyName = companyName;
    if (industry) company.industry = industry;
    if (companySize) company.companySize = companySize;
    if (foundedYear) company.foundedYear = foundedYear;
    if (website) company.website = website;
    company.location = location;
    if (aboutCompany) company.aboutCompany = aboutCompany;

    // Update social links
    if (socialLinks) {
      company.socialLinks = {
        linkedin: socialLinks.linkedin || company.socialLinks.linkedin,
        twitter: socialLinks.twitter || company.socialLinks.twitter,
        facebook: socialLinks.facebook || company.socialLinks.facebook,
      };
    }

    // Handle company logo
    if (req.file) {
      if (!isValidImageSize(req.file.size)) {
        return res.status(400).json({
          success: false,
          message: 'Image size must be less than 5MB',
        });
      }
      company.companyLogo = req.file.path; // Cloudinary URL or local path
    }

    await company.save();

    res.status(200).json({
      success: true,
      message: 'Company profile updated successfully',
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating company profile',
      error: error.message,
    });
  }
};

// @route   POST /api/recruiter/company-profile
// @desc    Create company profile
// @access  Private (Recruiter only)
exports.createCompanyProfile = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const { companyName, location } = req.body;

    if (!companyName || !location) {
      return res.status(400).json({
        success: false,
        message: 'Company name and location are required',
      });
    }

    const existingCompany = await Company.findOne({ recruiterId });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company profile already exists',
      });
    }

    const company = await Company.create({
      recruiterId,
      companyName,
      location,
    });

    res.status(201).json({
      success: true,
      message: 'Company profile created successfully',
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating company profile',
      error: error.message,
    });
  }
};

// Utility functions
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

function isValidImageSize(sizeInBytes) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return sizeInBytes <= maxSize;
}
