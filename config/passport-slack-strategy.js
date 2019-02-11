const SlackStrategy = require("passport-slack").Strategy;
const passport = require("passport");

const User = require("../models/user-model.js");

passport.use(
  new SlackStrategy(
    {
      clientID: process.env.SLACK_ID,
      clientSecret: process.env.SLACK_SECRET,
      scope: ["identity.basic", "identity.email"],
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("SLACK user info ___________", profile);

      User.findOne({ slackID: profile.id })
        .then(user => {
          console.log(user);
          if (user) {
            return done(null, user);
          }

          const newUser = new User({
            slackID: profile.id,
            fullName: profile.displayName,
            email: profile.user.email
          });

          newUser.save().then(user => {
            done(null, newUser);
          });
        })
        .catch(error => {
          done(error);
        });
    }
  )
);
