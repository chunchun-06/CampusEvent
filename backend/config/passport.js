const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
          // Update google_id if not set
          if (!rows[0].google_id) {
            await pool.query('UPDATE users SET google_id = ? WHERE email = ?', [googleId, email]);
          }
          return done(null, rows[0]);
        }

        // Create new student user
        const [result] = await pool.query(
          'INSERT INTO users (name, email, google_id, role) VALUES (?, ?, ?, ?)',
          [name, email, googleId, 'student']
        );

        const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        return done(null, newUser[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
