const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");

const router = express.Router();

router.get("/signup-login", (req, res, next) => {
  res.render("auth-views/signup-login.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { fullName, userName, email, password, bio, image } = req.body;

  if (!password || !password.match(/[0-9]/)) {
    // req.flash ?
    res.redirect("/signup-login");
    console.log("password problem");
    return;
  }

  const encryptedPassword = bcrypt.hashSync(password, 10);

  User.create({ fullName, userName, email, encryptedPassword, bio, image })
    .then(() => {
      // req.flash("error", "Probleme de mdp.");
      res.redirect("/dashboard");
    })
    .catch(err => next(err));
});

router.post("/signup-login", (res, req, next) => {
  const { userName, password } = req.body;

  User.findOne({ userName: { $eq: userName } })
    .then(userDoc => {
      if (!userDoc) {
        // req.flash ?
        res.redirect("/signup-login");
        return;
      }

      const { encryptedPassword } = userDoc;

      if (!bcrypt.compareSync(password, encryptedPassword)) {
        // req.flash ?
        res.redirect("/signup-login");
        return;
      }

      req.logIn(userDoc, () => {
        // req.flash ?
        res.redirect("/dashboard");
      });
    })
    .catch(err => next(err));
});

router.get("/logout", (req, res, next) => {
  req.logOut();
  // req.flash ?
  res.redirect("/");
});

module.exports = router;
