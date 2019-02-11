const passport = require("passport");

const User = require("../models/user-model.js");

require("./passport-slack-strategy.js");

passport.serializeUser((userDoc, done) => {
  done(null, userDoc._id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then(userDoc => {
      done(null, userDoc);
    })
    .catch(err => done(err));
});
