const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const passport = require("passport");

const User = require("../models/user-model.js");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/google/user-info",
      passReqToCallback: true,
      proxy: true
    },
    (req, accessToken, refreshToken, profile, done) => {
      console.log("GOOGLE USER __________", profile);

      const { displayName, emails } = profile;

      User.findOne({ email: { $eq: emails[0].value } })
        .then(userDoc => {
          if (userDoc) {
            done(null, userDoc);
            return;
          }

          User.create({
            fullName: displayName,
            email: emails[0].value,
            image: profile.photos[0].value.replace("?sz=50", "?sz=128"),
            googleID: profile.id
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
