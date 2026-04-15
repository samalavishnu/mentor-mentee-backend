const Follow       = require('../models/Follow');
const Conversation = require('../models/Conversation');
const MentorProfile = require('../models/MentorProfile');
const User         = require('../models/User');

// POST /api/follow/:mentorId  → send follow REQUEST
const followMentor = async (req, res, next) => {
  try {
    const mentor = await User.findById(req.params.mentorId);
    if (!mentor || mentor.role !== 'mentor')
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    if (req.params.mentorId === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });

    const existing = await Follow.findOne({ follower: req.user._id, following: req.params.mentorId });
    if (existing)
      return res.status(400).json({ success: false, message: `Request already ${existing.status}` });

    const follow = await Follow.create({
      follower:  req.user._id,
      following: req.params.mentorId,
      status:    'pending',
    });
    res.status(201).json({ success: true, message: 'Follow request sent', follow });
  } catch (error) { next(error); }
};

// PUT /api/follow/:mentorId/accept  → mentor accepts
const acceptFollow = async (req, res, next) => {
  try {
    const follow = await Follow.findOne({ follower: req.params.mentorId, following: req.user._id })
      || await Follow.findOne({ follower: req.params.mentorId, following: req.user._id });

    // mentorId here is actually the followerId from mentor's perspective
    const follow2 = await Follow.findOne({
      follower:  req.params.mentorId,
      following: req.user._id,
      status:    'pending',
    });

    const target = follow2;
    if (!target)
      return res.status(404).json({ success: false, message: 'Follow request not found' });
    if (target.following.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    target.status = 'accepted';
    await target.save();

    // Increment followers count
    await MentorProfile.findOneAndUpdate({ user: req.user._id }, { $inc: { followers: 1 } });

    // Create conversation between the two
    const exists = await Conversation.findOne({
      participants: { $all: [target.follower, req.user._id] },
    });
    if (!exists) {
      await Conversation.create({ participants: [target.follower, req.user._id] });
    }

    res.json({ success: true, message: 'Follow request accepted, chat unlocked' });
  } catch (error) { next(error); }
};

// PUT /api/follow/:mentorId/reject  → mentor rejects
const rejectFollow = async (req, res, next) => {
  try {
    const target = await Follow.findOne({
      follower:  req.params.mentorId,
      following: req.user._id,
      status:    'pending',
    });
    if (!target)
      return res.status(404).json({ success: false, message: 'Request not found' });

    target.status = 'rejected';
    await target.save();
    res.json({ success: true, message: 'Follow request rejected' });
  } catch (error) { next(error); }
};

// DELETE /api/follow/:mentorId  → unfollow
const unfollowMentor = async (req, res, next) => {
  try {
    const follow = await Follow.findOneAndDelete({
      follower: req.user._id, following: req.params.mentorId,
    });
    if (!follow)
      return res.status(404).json({ success: false, message: 'Not following' });

    if (follow.status === 'accepted') {
      await MentorProfile.findOneAndUpdate({ user: req.params.mentorId }, { $inc: { followers: -1 } });
    }
    res.json({ success: true, message: 'Unfollowed' });
  } catch (error) { next(error); }
};

// GET /api/follow/following
const getFollowing = async (req, res, next) => {
  try {
    const follows = await Follow.find({ follower: req.user._id })
      .populate('following', 'name email avatar bio role');
    res.json({ success: true, following: follows });
  } catch (error) { next(error); }
};

// GET /api/follow/requests  → pending requests for mentor
const getFollowRequests = async (req, res, next) => {
  try {
    const requests = await Follow.find({ following: req.user._id, status: 'pending' })
      .populate('follower', 'name email avatar bio');
    res.json({ success: true, requests });
  } catch (error) { next(error); }
};

// GET /api/follow/check/:mentorId
const checkFollow = async (req, res, next) => {
  try {
    const follow = await Follow.findOne({ follower: req.user._id, following: req.params.mentorId });
    res.json({ success: true, follow: follow || null, isFollowing: !!follow, status: follow?.status || null });
  } catch (error) { next(error); }
};

module.exports = { followMentor, acceptFollow, rejectFollow, unfollowMentor, getFollowing, getFollowRequests, checkFollow };
