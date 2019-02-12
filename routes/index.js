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
    basalMetabolism = 10 * weight + 6.25 * height - 5 * age - 5;
  } else {
    basalMetabolism = 10 * weight + 6.25 * height - 5 * age + 161;
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

  water = (weight - 20) * 15 + 1500;
  metabolismNeed = Math.round(basalMetabolism * activityRatio);
  bmi = Math.round((weight / Math.pow(height, 2)) * 10000);
  objectiveNeed = metabolismNeed + metabolismNeed * dietRatio;

  return {water, basalMetabolism, metabolismNeed, bmi, objectiveNeed};
}

// CALCULE METABOLISME BASAL
// Formule Mifflin-St Jeor
// Pour les femmes : (10 × poids en kg) + (6,25 x hauteur en cm) - (5 × âge en années) - 161
// Pour les hommes : (10 x poids en kg) + (6,25 x hauteur en cm) - (5 x âge en années) + 5

// COEFFICIENT ACTIVITE :
// "Sedentary" = 1,2
// "Little Active" = 1,375
// "Moderately Active" = 1,55
// "Very Active" = 1,725
// "Hyper Active" = 1,9

// BESOIN EN EAU
// (Poid en kg - 20) * 15 + 1500 = besoin en ml (Apport global)

// Apport par aliment :
// Aliments	Pourcentages en eau
// Légumes verts	90 %
// Fruits frais	80 à 95 %
// Œufs	75 %
// Viande, poisson	65 à 70 %
// Hamburger	45 %
// Fromage à pâte molle	50 %
// Fromage à pâte dure	35 %
// Yaourt	90 %
// Pain	35 %
// Fruits secs	20 %
// Céréales (pâtes, riz, semoule, farines, légumes secs)	10 à 15 %
// Beurre	15 %
// Huiles, sucre	0 %

// DIET.ENUM
// CHECK /models/user-data.js // need Nizar feedback

// CALCULE MACRO
// diet.enum match the value stored in the code
// basalMetabolism * % diet.enum.protein.value = MACRO-PROTEIN (dailyNeed.protein)
// basalMetabolism * % diet.enum.carbs.value = MACRO-CARBS (dailyNeed.carbs)
// basalMetabolism * % diet.enum.lipid.value = MACRO-LIPID (dailyNeed.lipid)

// Pour le seed file avec les valeurs
// enum: [
//   "Balanced",
//   "Moderate",
//   "Fitness",
//   "Mediterranean",
//   "Low Fat",
//   "Low Carbs",
//   "Body Builder",
//   "Ketogenic"
// ]

module.exports = router;
