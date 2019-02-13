const express = require("express");
const router = express.Router();
const UserProfile = require("../models/user-profile-model.js");
const UserData = require("../models/user-data-model.js");
const dietReference = require("../models/diet-data-model.js");

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
          const {dietReference} = dietRef[0]._id;
          UserData.create({
            userId,
            dietReference,
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
    .then(data => {
      // res.json(data);
      res.locals.data = data[0];
      res.render("steps-final.hbs");
    })
    .catch(err => next(err));
});

function generalCalcul(data) {
  const {height, weight, age, gender, activity, objective} = data;
  var activityRatio = 0,
    basalMetabolism = 0,
    dietRatio = 0,
    objectiveNeed = 0;

  if (gender === "Female") {
    basalMetabolism = Math.round(10 * weight + 6.25 * height - 5 * age - 5);
  } else {
    basalMetabolism = Math.round(10 * weight + 6.25 * height - 5 * age + 161);
  }

  switch (activity) {
    case "Sedentary":
      activityRatio = 1.2;
      break;
    case "Little Active":
      activityRatio = 1.375;
      break;
    case "Moderately Active":
      activityRatio = 1.55;
      break;
    case "Very Acive":
      activityRatio = 1.725;
      break;
    case "Hyper Active":
      activityRatio = 1.9;
      break;
  }

  switch (objective) {
    case "Weight Loss":
      dietRatio = -20 / 100;
      break;
    case "Slow Weight Loss":
      dietRatio = -10 / 100;
      break;
    case "Maintain":
      dietRatio = 1;
      break;
    case "Slow Weight Gain":
      dietRatio = 10 / 100;
      break;
    case "Weight Gain":
      dietRatio = 20 / 100;
      break;
  }

  water = Math.round((weight - 20) * 15 + 1500);
  metabolismNeed = Math.round(basalMetabolism * activityRatio);
  bmi = Math.round((weight / Math.pow(height, 2)) * 10000);
  objectiveNeed = Math.round(metabolismNeed + metabolismNeed * dietRatio);

  return {water, basalMetabolism, metabolismNeed, bmi, objectiveNeed};
}


module.exports = router;
