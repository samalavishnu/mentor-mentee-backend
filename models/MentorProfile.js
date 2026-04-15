const mongoose = require('mongoose');

// Each certification now stores a Cloudinary image URL instead of a local file
const certificationSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  issuer:       { type: String, required: true, trim: true },
  issueDate:    { type: String, default: '' },
  credentialId: { type: String, trim: true, default: '' },
  imageUrl:     { type: String, default: '' },   // Cloudinary URL (image or PDF preview)
  verified:     { type: Boolean, default: false }, // verified by admin
  uploadedAt:   { type: Date, default: Date.now },
});

const mentorProfileSchema = new mongoose.Schema(
  {
    user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    profilePhoto: { type: String, default: '' },              // Cloudinary URL for mentor profile photo
    skills:       [{ type: String, trim: true }],
    experience:   { type: Number, default: 0, min: 0 },
    title:        { type: String, trim: true, default: '' },
    company:      { type: String, trim: true, default: '' },
    linkedin:     { type: String, trim: true, default: '' },
    github:       { type: String, trim: true, default: '' },
    website:      { type: String, trim: true, default: '' },
    availability: { type: String, enum: ['available','busy','unavailable'], default: 'available' },
    hourlyRate:   { type: Number, default: 0, min: 0 },
    upiId:            { type: String, trim: true, default: '' },
    paymentRequired:  { type: Boolean, default: false },
    certifications:   [certificationSchema],
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalSessions:{ type: Number, default: 0 },
    followers:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MentorProfile', mentorProfileSchema);
