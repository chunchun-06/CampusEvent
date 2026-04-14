const {
  getApprovedEvents, getEventById, getOrganizerEvents, getPendingEvents,
  createEvent, updateEvent, updateEventStatus,
} = require('../models/eventModel');
const { registerForEvent, isAlreadyRegistered, getEventRegistrations } = require('../models/registrationModel');
const { createEventSchema, updateStatusSchema } = require('../validation/eventSchemas');

const listEvents = async (req, res) => {
  const { type, ref_id, search } = req.query;
  const events = await getApprovedEvents({ type, ref_id, search });
  res.json(events);
};

const getEvent = async (req, res) => {
  const event = await getEventById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  res.json(event);
};

const createEventHandler = async (req, res) => {
  const { error, value } = createEventSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const id = await createEvent({ ...value, created_by: req.user.id });
  res.status(201).json({ id, ...value, status: 'pending' });
};

const updateEventHandler = async (req, res) => {
  const event = await getEventById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  if (event.created_by !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to edit this event.' });
  }

  const { error, value } = createEventSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  await updateEvent(req.params.id, value);
  res.json({ message: 'Event updated successfully.' });
};

const updateStatus = async (req, res) => {
  const { error, value } = updateStatusSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const event = await getEventById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found.' });

  await updateEventStatus(req.params.id, value.status);
  res.json({ message: `Event ${value.status} successfully.` });
};

const getOrganizerEventsHandler = async (req, res) => {
  const events = await getOrganizerEvents(req.user.id);
  res.json(events);
};

const getPendingEventsHandler = async (req, res) => {
  const events = await getPendingEvents();
  res.json(events);
};

const registerEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const event = await getEventById(eventId);
  if (!event) return res.status(404).json({ message: 'Event not found.' });
  if (event.status !== 'approved') return res.status(400).json({ message: 'Event is not open for registration.' });

  // Check capacity
  if (event.capacity && event.registration_count >= event.capacity) {
    return res.status(400).json({ message: 'Event is full.' });
  }

  const already = await isAlreadyRegistered(userId, eventId);
  if (already) return res.status(409).json({ message: 'You are already registered for this event.' });

  await registerForEvent(userId, eventId);
  res.status(201).json({ message: 'Successfully registered for the event!' });
};

const getRegistrations = async (req, res) => {
  const event = await getEventById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found.' });

  if (event.created_by !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized.' });
  }

  const registrations = await getEventRegistrations(req.params.id);
  res.json(registrations);
};

module.exports = {
  listEvents, getEvent, createEventHandler, updateEventHandler,
  updateStatus, getOrganizerEventsHandler, getPendingEventsHandler,
  registerEvent, getRegistrations,
};
