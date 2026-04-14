const express = require('express');
const router = express.Router();
const { getOverview, listUsers, listPendingClubs, listPendingEvents } = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');

router.use(verifyToken, requireAdmin);

router.get('/overview', getOverview);
router.get('/users', listUsers);
router.get('/pending-clubs', listPendingClubs);
router.get('/pending-events', listPendingEvents);

module.exports = router;
