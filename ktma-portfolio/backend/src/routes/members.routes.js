const router = require('express').Router();
const { getCommittee, getBusinessMembers } = require('../controllers/members.controller');

router.get('/committee', getCommittee);
router.get('/business', getBusinessMembers);

module.exports = router;
