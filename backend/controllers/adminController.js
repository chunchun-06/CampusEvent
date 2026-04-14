const pool = require('../config/db');
const { getAllUsers } = require('../models/userModel');
const { getPendingClubs } = require('../models/clubModel');
const { getPendingEvents } = require('../models/eventModel');

const getOverview = async (req, res) => {
  const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
  const [[{ totalEvents }]] = await pool.query('SELECT COUNT(*) as totalEvents FROM events WHERE status = "approved"');
  const [[{ pendingEvents }]] = await pool.query('SELECT COUNT(*) as pendingEvents FROM events WHERE status = "pending"');
  const [[{ totalClubs }]] = await pool.query('SELECT COUNT(*) as totalClubs FROM clubs WHERE approved = 1');
  const [[{ pendingClubs }]] = await pool.query('SELECT COUNT(*) as pendingClubs FROM clubs WHERE approved = 0');
  const [[{ totalRegistrations }]] = await pool.query('SELECT COUNT(*) as totalRegistrations FROM registrations');

  res.json({ totalUsers, totalEvents, pendingEvents, totalClubs, pendingClubs, totalRegistrations });
};

const listUsers = async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
};

const listPendingClubs = async (req, res) => {
  const clubs = await getPendingClubs();
  res.json(clubs);
};

const listPendingEvents = async (req, res) => {
  const events = await getPendingEvents();
  res.json(events);
};

module.exports = { getOverview, listUsers, listPendingClubs, listPendingEvents };
