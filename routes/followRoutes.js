const express = require('express');
const router  = express.Router();
const { followMentor, acceptFollow, rejectFollow, unfollowMentor, getFollowing, getFollowRequests, checkFollow } = require('../controllers/followController');
const { protect } = require('../middleware/authMiddleware');

router.get('/following',         protect, getFollowing);
router.get('/requests',          protect, getFollowRequests);      // mentor sees pending requests
router.get('/check/:mentorId',   protect, checkFollow);
router.post('/:mentorId',        protect, followMentor);           // send request
router.put('/:mentorId/accept',  protect, acceptFollow);           // mentor accepts
router.put('/:mentorId/reject',  protect, rejectFollow);           // mentor rejects
router.delete('/:mentorId',      protect, unfollowMentor);

module.exports = router;
