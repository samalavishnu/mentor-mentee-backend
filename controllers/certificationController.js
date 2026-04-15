const MentorProfile = require('../models/MentorProfile');

// Optional: soft-validate Cloudinary URLs
const isValidCloudinaryUrl = (url) => {
  if (!url) return true; // empty is fine
  return url.startsWith('https://res.cloudinary.com/') || url.startsWith('https://');
};

// GET /api/certifications/my
const getMyCertifications = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, certifications: profile.certifications });
  } catch (error) { next(error); }
};

// GET /api/certifications/mentor/:mentorId  (public)
const getMentorCertifications = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findOne({ user: req.params.mentorId });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.json({ success: true, certifications: profile.certifications });
  } catch (error) { next(error); }
};

// POST /api/certifications  — accepts JSON body (no file upload)
const addCertification = async (req, res, next) => {
  try {
    const { title, issuer, issueDate, credentialId, imageUrl } = req.body;
    if (!title || !issuer) return res.status(400).json({ success: false, message: 'Title and Issuer are required' });

    if (imageUrl && !isValidCloudinaryUrl(imageUrl)) {
      return res.status(400).json({ success: false, message: 'Invalid image URL provided' });
    }

    let profile = await MentorProfile.findOne({ user: req.user._id });
    if (!profile) profile = await MentorProfile.create({ user: req.user._id });

    const cert = {
      title,
      issuer,
      issueDate:    issueDate    || '',
      credentialId: credentialId || '',
      imageUrl:     imageUrl     || '',
    };

    profile.certifications.push(cert);
    await profile.save();

    const added = profile.certifications[profile.certifications.length - 1];
    res.status(201).json({ success: true, certification: added });
  } catch (error) { next(error); }
};

// DELETE /api/certifications/:certId
const deleteCertification = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    const cert = profile.certifications.id(req.params.certId);
    if (!cert) return res.status(404).json({ success: false, message: 'Certification not found' });

    // No local file to delete — Cloudinary URLs are just strings
    profile.certifications.pull(req.params.certId);
    await profile.save();
    res.json({ success: true, message: 'Certification deleted' });
  } catch (error) { next(error); }
};

// PUT /api/certifications/:certId/verify  (admin only)
const verifyCertification = async (req, res, next) => {
  try {
    const profile = await MentorProfile.findOne({ 'certifications._id': req.params.certId });
    if (!profile) return res.status(404).json({ success: false, message: 'Not found' });

    const cert = profile.certifications.id(req.params.certId);
    cert.verified = !cert.verified;
    await profile.save();

    res.json({ success: true, message: `Certification ${cert.verified ? 'verified' : 'unverified'}`, certification: cert });
  } catch (error) { next(error); }
};

// PUT /api/certifications/profile-photo  — update mentor's profilePhoto URL
const updateProfilePhoto = async (req, res, next) => {
  try {
    const { profilePhoto } = req.body;
    if (!profilePhoto) return res.status(400).json({ success: false, message: 'profilePhoto URL is required' });

    if (!isValidCloudinaryUrl(profilePhoto)) {
      return res.status(400).json({ success: false, message: 'Invalid URL provided' });
    }

    let profile = await MentorProfile.findOne({ user: req.user._id });
    if (!profile) profile = await MentorProfile.create({ user: req.user._id });

    profile.profilePhoto = profilePhoto;
    await profile.save();

    res.json({ success: true, profilePhoto, message: 'Profile photo updated' });
  } catch (error) { next(error); }
};

module.exports = {
  getMyCertifications,
  getMentorCertifications,
  addCertification,
  deleteCertification,
  verifyCertification,
  updateProfilePhoto,
};
