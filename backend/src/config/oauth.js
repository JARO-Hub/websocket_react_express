// src/config/oauth.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function setupPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (_, __, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
            });
          }

          return done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  return passport;
};
