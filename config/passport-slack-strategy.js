const SlackStrategy = require("passport-slack").Strategy;
const passport = require("passport");

const User = require("../models/user-model.js");

passport.use(
  new SlackStrategy(
    {
      clientID: process.env.SLACK_ID,
      clientSecret: process.env.SLACK_SECRET,
      scope: ["identity.basic", "identity.email", "identity.avatar"],
      passReqToCallback: true,
      proxy: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      console.log("SLACK USER __________", profile);

      const { name, email, image } = profile;

      User.findOne({ email: { $eq: email } })
        .then(userDoc => {
          if (userDoc) {
            done(null, userDoc);
            return;
          }

          User.create({
            fullName: profile.user.name,
            email: profile.user.email,
            image: profile.user.image_192,
            slackID: profile.id
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
