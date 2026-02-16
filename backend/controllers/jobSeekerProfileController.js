const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   GET /api/profile
// @desc    Get job seeker profile
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      // Create default profile if not exists
      const user = await User.findById(req.user.id);
      profile = await Profile.create({
        userId: req.user.id,
        fullName: user.fullName || user.name || '',
        email: user.email,
        phone: user.phone || '',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// @route   GET /api/profile/:userId
// @desc    Get profile by user ID (public view)
// @access  Public
exports.getProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// @route   PUT /api/profile
// @desc    Update profile (with photo/resume upload)
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      headline,
      summary,
      experienceLevel,
      skills,
      location,
      portfolioLink,
      linkedinLink,
      githubLink,
      majorProjectLink,
    } = req.body;

    // Validation
    if (!fullName || fullName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Full name is required',
      });
    }

    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      profile = new Profile({
        userId: req.user.id,
        fullName,
        email: req.user.email,
      });
    }

    // Update basic fields
    profile.fullName = fullName;
    if (phone) profile.phone = phone;
    if (headline) profile.headline = headline;
    if (summary) profile.summary = summary;
    if (experienceLevel) profile.experienceLevel = experienceLevel;
    if (skills) profile.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
    if (location) profile.location = location;
    if (portfolioLink) profile.portfolioLink = portfolioLink;
    if (linkedinLink) profile.linkedinLink = linkedinLink;
    if (githubLink) profile.githubLink = githubLink;
    if (majorProjectLink) profile.majorProjectLink = majorProjectLink;

    // Handle file uploads
    if (req.files?.profilePhoto) {
      profile.profilePhoto = req.files.profilePhoto[0].path;
    }
    if (req.files?.resume) {
      profile.resumeURL = req.files.resume[0].path;
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
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// @route   POST /api/profile/education
// @desc    Add education to profile
// @access  Private
exports.addEducation = async (req, res) => {
  try {
    const { institution, degree, fieldOfStudy, startDate, endDate, grade, description } = req.body;

    if (!institution || !degree) {
      return res.status(400).json({
        success: false,
        message: 'Institution and degree are required',
      });
    }

    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.education.push({
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      grade,
      description,
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Education added successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding education',
      error: error.message,
    });
  }
};

// @route   PUT /api/profile/education/:eduId
// @desc    Update education in profile
// @access  Private
exports.updateEducation = async (req, res) => {
  try {
    const { eduId } = req.params;
    const { institution, degree, fieldOfStudy, startDate, endDate, grade, description } = req.body;

    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const education = profile.education.id(eduId);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found',
      });
    }

    if (institution) education.institution = institution;
    if (degree) education.degree = degree;
    if (fieldOfStudy) education.fieldOfStudy = fieldOfStudy;
    if (startDate) education.startDate = startDate;
    if (endDate) education.endDate = endDate;
    if (grade) education.grade = grade;
    if (description) education.description = description;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Education updated successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating education',
      error: error.message,
    });
  }
};

// @route   DELETE /api/profile/education/:eduId
// @desc    Delete education from profile
// @access  Private
exports.deleteEducation = async (req, res) => {
  try {
    const { eduId } = req.params;

    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.education.id(eduId).remove();
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Education deleted successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting education',
      error: error.message,
    });
  }
};

// @route   POST /api/profile/work-experience
// @desc    Add work experience to profile
// @access  Private
exports.addWorkExperience = async (req, res) => {
  try {
    const { company, title, location, startDate, currentlyWorking, endDate, description } = req.body;

    if (!company || !title) {
      return res.status(400).json({
        success: false,
        message: 'Company and title are required',
      });
    }

    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.workExperience.push({
      company,
      title,
      location,
      startDate,
      endDate,
      currentlyWorking: currentlyWorking || false,
      description,
    });

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Work experience added successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding work experience',
      error: error.message,
    });
  }
};

// @route   PUT /api/profile/work-experience/:expId
// @desc    Update work experience in profile
// @access  Private
exports.updateWorkExperience = async (req, res) => {
  try {
    const { expId } = req.params;
    const { company, title, location, startDate, endDate, currentlyWorking, description } = req.body;

    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const experience = profile.workExperience.id(expId);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Work experience not found',
      });
    }

    if (company) experience.company = company;
    if (title) experience.title = title;
    if (location) experience.location = location;
    if (startDate) experience.startDate = startDate;
    if (endDate) experience.endDate = endDate;
    if (currentlyWorking !== undefined) experience.currentlyWorking = currentlyWorking;
    if (description) experience.description = description;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Work experience updated successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating work experience',
      error: error.message,
    });
  }
};

// @route   DELETE /api/profile/work-experience/:expId
// @desc    Delete work experience from profile
// @access  Private
exports.deleteWorkExperience = async (req, res) => {
  try {
    const { expId } = req.params;

    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.workExperience.id(expId).remove();
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Work experience deleted successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting work experience',
      error: error.message,
    });
  }
};

// @route   POST /api/profile/skills
// @desc    Add skill to profile
// @access  Private
exports.addSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill) {
      return res.status(400).json({
        success: false,
        message: 'Skill is required',
      });
    }

    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    if (!profile.skills.includes(skill)) {
      profile.skills.push(skill);
    }

    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding skill',
      error: error.message,
    });
  }
};

// @route   DELETE /api/profile/skills/:skill
// @desc    Delete skill from profile
// @access  Private
exports.deleteSkill = async (req, res) => {
  try {
    const { skill } = req.params;

    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    profile.skills = profile.skills.filter((s) => s !== skill);
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting skill',
      error: error.message,
    });
  }
};
