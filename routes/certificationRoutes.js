const express = require('express');
const router  = express.Router();
const {
  getMyCertifications,
  getMentorCertifications,
  addCertification,
  deleteCertification,
  verifyCertification,
  updateProfilePhoto,
} = require('../controllers/certificationController');
const { protect }   = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public
router.get('/mentor/:mentorId', getMentorCertifications);

// Mentor only — all JSON body, no file upload middleware
router.get('/my',              protect, authorize('mentor'), getMyCertifications);
router.post('/',               protect, authorize('mentor'), addCertification);
router.delete('/:certId',      protect, authorize('mentor'), deleteCertification);
router.put('/profile-photo',   protect, authorize('mentor'), updateProfilePhoto);

// Admin verification
router.put('/:certId/verify',  protect, authorize('admin'), verifyCertification);

module.exports = router;
