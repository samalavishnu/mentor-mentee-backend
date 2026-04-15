const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema(
  {
    platformName:          { type: String, default: 'MentorHub' },
    commissionPercentage:  { type: Number, default: 10, min: 0, max: 100 },
    registrationEnabled:   { type: Boolean, default: true },
    maintenanceMode:       { type: Boolean, default: false },
    maintenanceMessage:    { type: String, default: 'Platform is under maintenance. Please check back soon.' },
    contactEmail:          { type: String, default: 'support@mentorhub.com' },
    maxSessionDuration:    { type: Number, default: 180 }, // minutes
    allowGuestBrowsing:    { type: Boolean, default: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Singleton: only one settings doc
platformSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) settings = await this.create({});
  return settings;
};

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
