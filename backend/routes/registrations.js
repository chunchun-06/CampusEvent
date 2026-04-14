const express = require('express');
const router = express.Router();
const { getMyRegistrations } = require('../models/registrationModel');
const { verifyToken } = require('../middleware/auth');

router.get('/me', verifyToken, async (req, res) => {
  const registrations = await getMyRegistrations(req.user.id);
  res.json(registrations);
});

module.exports = router;
