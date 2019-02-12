const SlackStrategy = require("passport-slack").Strategy;
const passport = require("passport");

const User = require("../models/user-model.js");

passport.use(
  new SlackStrategy(
    {
      clientID: process.env.SLACK_ID,
      clientSecret: process.env.SLACK_SECRET,
      scope: ["identity.basic", "identity.email"],
      passReqToCallback: true,
      proxy: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      console.log("GOOGLE USER __________", profile);

      const { displayName, emails } = profile;

      User.findOne({ email: { $eq: profile.user.email } })
        .then(userDoc => {
          if (userDoc) {
            done(null, userDoc);
            return;
          }

          User.create({
            fullName: profile.displayName,
            email: profile.user.email
          })
            .then(userDoc => {
              req.session.returnTo = "/get-started";
              done(null, userDoc);
            })
            .catch(err => done(err));
        })
        .catch(error => {
          done(error);
        });
    }
  )
);
