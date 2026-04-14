const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { signup, login, googleCallback, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login`, session: false }),
  googleCallback
);

router.get('/me', verifyToken, getMe);

module.exports = router;
