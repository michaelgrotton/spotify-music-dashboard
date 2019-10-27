//passport.js setup for google oauth
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const keys = require("../config/keys");
const mongoose = require("mongoose");
const { analysis, populate } = require("../services/spotifyApiClient");

const User = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: keys.spotifyClientID,
      clientSecret: keys.spotifyClientSecret,
      callbackURL: "/auth/spotify/callback",
      proxy: true
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
      const existingUser = await User.findOne({
        spotifyId: profile.id
      });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({
        spotifyId: profile.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: new Date(Date.now() + 3600 * 1000)
      }).save();

      populate(user);
      analysis(user);

      done(null, user);
    }
  )
);
