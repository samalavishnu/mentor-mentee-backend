const User          = require('../models/User');
const MentorProfile = require('../models/MentorProfile');

const getMentors = async (req, res, next) => {
  try {
    const { skill, availability, minRating, minExperience, search, page=1, limit=12 } = req.query;
    const profileFilter = {};
    if (skill)         profileFilter.skills       = { $in: [new RegExp(skill,'i')] };
    if (availability)  profileFilter.availability = availability;
    if (minRating)     profileFilter.rating        = { $gte: parseFloat(minRating) };
    if (minExperience) profileFilter.experience    = { $gte: parseInt(minExperience) };

    const userFilter = { role: 'mentor', isActive: true };
    if (search) userFilter.name = { $regex: search, $options: 'i' };

    const mentorUsers = await User.find(userFilter).select('-password');
    profileFilter.user = { $in: mentorUsers.map(u=>u._id) };

    const skip  = (page-1)*limit;
    const total = await MentorProfile.countDocuments(profileFilter);
    const profiles = await MentorProfile.find(profileFilter)
      .populate('user','name email avatar bio')
      .sort({ rating:-1, followers:-1 })
      .skip(skip).limit(parseInt(limit));

    res.json({ success:true, count:profiles.length, total, pages:Math.ceil(total/limit), currentPage:parseInt(page), mentors:profiles });
  } catch (error) { next(error); }
};

const getMentor = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findOne({ user: req.params.id })
      .populate('user','name email avatar bio createdAt');
    if (!profile) return res.status(404).json({ success:false, message:'Mentor not found' });
    res.json({ success:true, mentor:profile });
  } catch (error) { next(error); }
};

const updateMentorProfile = async (req, res, next) => {
  try {
    const { skills, experience, title, company, linkedin, github, website, availability, hourlyRate, upiId, paymentRequired, profilePhoto } = req.body;
    let profile = await MentorProfile.findOne({ user: req.user._id });
    if (!profile) profile = await MentorProfile.create({ user: req.user._id });

    const updates = { skills, experience, title, company, linkedin, github, website, availability, hourlyRate, upiId, paymentRequired, profilePhoto };
    Object.keys(updates).forEach(k => updates[k]===undefined && delete updates[k]);

    profile = await MentorProfile.findOneAndUpdate(
      { user: req.user._id }, updates, { new:true, runValidators:true }
    ).populate('user','name email avatar bio');

    res.json({ success:true, profile });
  } catch (error) { next(error); }
};

const getMyProfile = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findOne({ user: req.user._id })
      .populate('user','name email avatar bio');
    if (!profile) return res.status(404).json({ success:false, message:'Profile not found' });
    res.json({ success:true, profile });
  } catch (error) { next(error); }
};

module.exports = { getMentors, getMentor, updateMentorProfile, getMyProfile };
