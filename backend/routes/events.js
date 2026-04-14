const express = require('express');
const router = express.Router();
const {
  listEvents, getEvent, createEventHandler, updateEventHandler,
  updateStatus, getOrganizerEventsHandler, getPendingEventsHandler,
  registerEvent, getRegistrations,
} = require('../controllers/eventController');
const { verifyToken } = require('../middleware/auth');
const { requireAdmin, requireOrganizer } = require('../middleware/roles');

router.get('/', listEvents);
router.get('/pending', verifyToken, requireAdmin, getPendingEventsHandler);
router.get('/organizer', verifyToken, requireOrganizer, getOrganizerEventsHandler);
router.get('/:id', getEvent);
router.post('/', verifyToken, requireOrganizer, createEventHandler);
router.put('/:id', verifyToken, requireOrganizer, updateEventHandler);
router.put('/:id/status', verifyToken, requireAdmin, updateStatus);
router.post('/:id/register', verifyToken, registerEvent);
router.get('/:id/registrations', verifyToken, getRegistrations);

module.exports = router;
