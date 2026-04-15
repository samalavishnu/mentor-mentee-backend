const User         = require('../models/User');
const MentorProfile = require('../models/MentorProfile');
const { sendTokenResponse } = require('../utils/helpers');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    // Only allow mentor/mentee via public register — admin created via seed or admin panel
    const allowedRoles = ['mentor', 'mentee'];
    const safeRole = allowedRoles.includes(role) ? role : 'mentee';

    const user = await User.create({ name, email, password, role: safeRole });

    if (user.role === 'mentor') {
      await MentorProfile.create({ user: user._id });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) { next(error); }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated. Contact support.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Account has been banned. Contact support.' });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) { next(error); }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

// PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

module.exports = { register, login, getMe, updateProfile };
