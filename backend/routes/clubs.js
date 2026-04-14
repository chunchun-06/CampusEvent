const express = require('express');
const router = express.Router();
const { listClubs, requestClub, approveClubHandler, deleteClubHandler, pendingClubs } = require('../controllers/clubController');
const { verifyToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');

router.get('/', listClubs);
router.post('/', verifyToken, requestClub);
router.get('/pending', verifyToken, requireAdmin, pendingClubs);
router.put('/:id/approve', verifyToken, requireAdmin, approveClubHandler);
router.delete('/:id', verifyToken, requireAdmin, deleteClubHandler);

module.exports = router;
