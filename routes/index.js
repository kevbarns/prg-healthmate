const express = require("express");
const router = express.Router();
const UserProfile = require("../models/user-profile-model.js");
const UserData = require("../models/user-data-model.js");
const dietReference = require("../models/diet-data-model.js");
const getMacro = require("../lib/get-macro.js");
const generalCalcul = require("../lib/generalCalcul.js");

router.get("/", (req, res, next) => {
  res.render("index.hbs");
});

router.get("/get-started", (req, res, next) => {
  res.render("steps.hbs");
});

router.post("/process-user-data", (req, res, next) => {
  const {height, weight, gender, age, activity, objective} = req.body;
  const userId = req.user._id;
  UserProfile.create({userId, height, weight, gender, age, activity, objective})
    .then(data => {
      // res.json(data);
      const calcs = generalCalcul(data);
      dietReference
        .find()
        .limit(1)
        .then(dietRef => {
          // res.json(dietRef);
          const dietId = dietRef[0]._id;
          UserData.create({
            userId,
            dietReference: {data: dietId},
            water: calcs.water,
            basalMetabolism: calcs.basalMetabolism,
            metabolismNeed: calcs.metabolismNeed,
            bmi: calcs.bmi,
            objectiveNeed: calcs.objectiveNeed
          })
            .then(dietData => {
              // res.json(dietData);
              res.redirect("/get-started-final");
            })
            .catch(err => {
              console.log("Profile Data insertion failed");
              next(err);
            });
        })
        .catch(err => {
          console.log(
            "No diet Reference found in the DietReference Collection"
          );
          next(err);
        });
    })
    .catch(err => {
      console.log("User Profile data failed", err);
    });
});

router.get("/get-started-final", (req, res, next) => {
  const userId = req.user._id;
  UserData.find({userId: {$eq: userId}})
    .sort({createdAt: -1})
    .limit(1)
    .populate("dietReference.data")
    .then(data => {
      // res.json(data);
      const macroz = getMacro(data);
      const protein = macroz.userProtein;
      const carbs = macroz.userCarbs;
      const lipid = macroz.userLipid;
      console.log(macroz.userProtein);
      UserData.findOneAndUpdate(
        {userId: {$eq: userId}},
        {$set: {macros: {protein, carbs, lipid}}}
      )
        .then(() => {
          res.locals.data = data[0];
          res.locals.diet = macroz;
          res.render("steps-final.hbs");
        })
        .catch();
    })
    .catch(err => next(err));
});

module.exports = router;