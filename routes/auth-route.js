const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user-model.js");

router.get("/signup-login", (req, res, next) => {
  res.render("auth-views/signup-login.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const {fullName, email, password, bio, image} = req.body;

  if (!password || !password.match(/[0-9]/)) {
    // req.flash ?
    res.redirect("/signup-login");
    console.log("password problem");
    return;
  }

  const encryptedPassword = bcrypt.hashSync(password, 10);
  const _id = req.body._id;
  User.create({_id, fullName, email, encryptedPassword, bio, image})
    .then(() => {
      // req.flash("error", "Probleme de mdp.");
      res.redirect("/get-started");
    })
    .catch(err => next(err));
});

router.post("/process-login", (req, res, next) => {
  const {email, password} = req.body;

  User.findOne({email: {$eq: email}})
    .then(userDoc => {
      if (!userDoc) {
        // req.flash ?
        console.log("prob d'ID");
        res.redirect("/signup-login");
        return;
      }

      const {encryptedPassword} = userDoc;

      if (!bcrypt.compareSync(password, encryptedPassword)) {
        // req.flash ?
        console.log("prob de mdp");
        res.redirect("/signup-login");
        return;
      }

      req.logIn(userDoc, () => {
        // req.flash ?
        res.redirect("/dahsboard");
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
